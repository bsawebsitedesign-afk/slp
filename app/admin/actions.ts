"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireAdmin, verifyPassword } from "@/lib/auth";
import { setContent, type ContentKey, type SiteContent } from "@/lib/content";
import { parseVideoId, syncChannel } from "@/lib/youtube";

export type ActionState = { error?: string; ok?: string };

const str = (fd: FormData, k: string) => ((fd.get(k) as string | null) ?? "").trim();
const nullable = (fd: FormData, k: string) => str(fd, k) || null;

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/episodes");
  revalidatePath("/contact");
  revalidatePath("/admin/content");
}

/* ------------------------------- auth ------------------------------- */

import { checkRateLimit, resetRateLimit } from "@/lib/rateLimit";

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, "email").toLowerCase().slice(0, 100);
  const password = str(fd, "password").slice(0, 128);
  if (!email || !password) return { error: "Enter your email and password." };

  const rateKey = `login:${email}`;
  const rate = checkRateLimit(rateKey, 5, 15 * 60 * 1000, 15 * 60 * 1000);

  if (!rate.allowed) {
    const mins = Math.ceil(rate.resetInSeconds / 60);
    return {
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${mins} minute${mins > 1 ? "s" : ""}.`,
    };
  }

  const user = await prisma.adminUser.findUnique({ where: { email } });
  // always run a verify so a missing user and a wrong password take the same time
  const ok = await verifyPassword(password, user?.password ?? "x:00");

  if (!user || !ok) {
    console.warn(`[SECURITY AUDIT] Failed login attempt for email: ${email}`);
    return { error: "Incorrect email or password." };
  }

  resetRateLimit(rateKey);
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------ episodes ------------------------------ */

/** Any admin edit locks the row so the next YouTube sync won't overwrite it. */
export async function saveEpisode(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Session expired. Please log in again to save changes." };
  }
  const id = str(fd, "id");

  const videoId = parseVideoId(str(fd, "youtubeId"));
  if (!videoId) return { error: "Enter a valid YouTube URL or 11-character video ID." };

  const title = str(fd, "title");
  if (!title) return { error: "Title is required." };

  const publishedAt = new Date(str(fd, "publishedAt") || Date.now());
  if (Number.isNaN(publishedAt.getTime())) return { error: "Publication date is not a valid date." };

  const thumbnail = str(fd, "thumbnail") || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  let links: unknown = [];
  const rawLinks = str(fd, "links");
  if (rawLinks) {
    try {
      links = JSON.parse(rawLinks);
      if (!Array.isArray(links)) throw new Error();
    } catch {
      return { error: 'External links must be JSON like [{"label":"Report","url":"https://…"}].' };
    }
  }

  const data = {
    youtubeId: videoId,
    title,
    description: str(fd, "description"),
    thumbnail,
    publishedAt,
    duration: nullable(fd, "duration"),
    published: fd.get("published") === "on",
    featured: fd.get("featured") === "on",
    order: Number(str(fd, "order")) || 0,
    summary: nullable(fd, "summary"),
    showNotes: nullable(fd, "showNotes"),
    transcript: nullable(fd, "transcript"),
    takeaways: str(fd, "takeaways").split("\n").map((s) => s.trim()).filter(Boolean),
    guestName: nullable(fd, "guestName"),
    guestTitle: nullable(fd, "guestTitle"),
    guestCompany: nullable(fd, "guestCompany"),
    guestPhoto: nullable(fd, "guestPhoto"),
    spotifyUrl: nullable(fd, "spotifyUrl"),
    appleUrl: nullable(fd, "appleUrl"),
    links: links as object,
    locked: true,
  };

  try {
    if (id) {
      await prisma.episode.update({ where: { id }, data });
    } else {
      await prisma.episode.create({ data: { ...data, source: "manual" } });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      return { error: "An episode with that YouTube video ID already exists." };
    }
    throw e;
  }

  // only one featured episode at a time
  if (data.featured) {
    const row = await prisma.episode.findUnique({ where: { youtubeId: videoId }, select: { id: true } });
    await prisma.episode.updateMany({ where: { featured: true, NOT: { id: row!.id } }, data: { featured: false } });
  }

  refreshPublic();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteEpisode(fd: FormData) {
  await requireAdmin();
  await prisma.episode.delete({ where: { id: str(fd, "id") } });
  refreshPublic();
  revalidatePath("/admin");
}

export async function togglePublished(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const ep = await prisma.episode.findUnique({ where: { id }, select: { published: true } });
  if (!ep) return;
  await prisma.episode.update({ where: { id }, data: { published: !ep.published } });
  refreshPublic();
  revalidatePath("/admin");
}

export async function setFeatured(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await prisma.$transaction([
    prisma.episode.updateMany({ where: { featured: true }, data: { featured: false } }),
    prisma.episode.update({ where: { id }, data: { featured: true, published: true } }),
  ]);
  refreshPublic();
  revalidatePath("/admin");
}

/** Move an episode up/down by swapping `order` with its neighbour. */
export async function reorder(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const dir = str(fd, "dir") === "up" ? 1 : -1;

  const all = await prisma.episode.findMany({ orderBy: [{ order: "desc" }, { publishedAt: "desc" }], select: { id: true, order: true } });
  const i = all.findIndex((e) => e.id === id);
  const j = i - dir; // "up" in the list = earlier index
  if (i < 0 || j < 0 || j >= all.length) return;

  // list order may not be reflected in stored `order` yet — restamp the whole list
  const swapped = [...all];
  [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
  await prisma.$transaction(
    swapped.map((e, idx) => prisma.episode.update({ where: { id: e.id }, data: { order: swapped.length - idx } })),
  );
  refreshPublic();
  revalidatePath("/admin");
}

export async function runSync(): Promise<void> {
  await requireAdmin();
  await syncChannel();
  refreshPublic();
  revalidatePath("/admin");
}

/* ------------------------------ content ------------------------------ */

export async function saveContent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Session expired. Please log in again to save changes." };
  }

  try {
    const key = str(fd, "__key") as ContentKey;
    if (!key) return { error: "Missing content key." };

    if (key === "members") {
      const raw = str(fd, "members_json");
      let membersList: any[] = [];
      try {
        membersList = JSON.parse(raw);
      } catch {
        membersList = [];
      }

      // Automatically offload any inline base64 images to database media storage so the document payload stays tiny
      for (let i = 0; i < membersList.length; i++) {
        const m = membersList[i];
        if (m && m.photo && typeof m.photo === "string" && m.photo.startsWith("data:")) {
          try {
            const [header, base64] = m.photo.split(",");
            const mimeMatch = header.match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
            const ext = mime.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
            const filename = `member-${m.id || i}-${Date.now()}.${ext}`;
            await prisma.setting.upsert({
              where: { key: `media:${filename}` },
              create: { key: `media:${filename}`, value: { mime, data: base64 } },
              update: { value: { mime, data: base64 } },
            });
            m.photo = `/api/media/${filename}`;
          } catch (offloadErr) {
            console.warn("[saveContent] Failed to offload base64 photo:", offloadErr);
          }
        }
      }

      await setContent("members", membersList as SiteContent["members"]);
    } else if (key === "slideshow") {
      const raw = str(fd, "slideshow_json");
      let slidesList: any[] = [];
      try {
        slidesList = JSON.parse(raw);
      } catch {
        slidesList = [];
      }
      slidesList = slidesList.filter((s: any) => s && s.src && typeof s.src === "string" && s.src.trim());

      // Offload any inline base64 slides to database media storage
      for (let i = 0; i < slidesList.length; i++) {
        const s = slidesList[i];
        if (s && s.src && typeof s.src === "string" && s.src.startsWith("data:")) {
          try {
            const [header, base64] = s.src.split(",");
            const mimeMatch = header.match(/:(.*?);/);
            const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
            const ext = mime.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
            const filename = `slide-${i}-${Date.now()}.${ext}`;
            await prisma.setting.upsert({
              where: { key: `media:${filename}` },
              create: { key: `media:${filename}`, value: { mime, data: base64 } },
              update: { value: { mime, data: base64 } },
            });
            s.src = `/api/media/${filename}`;
          } catch (offloadErr) {
            console.warn("[saveContent] Failed to offload base64 slide:", offloadErr);
          }
        }
      }

      await setContent("slideshow", slidesList as SiteContent["slideshow"]);
    } else if (key === "topics") {
      const titles = fd.getAll("topicTitle").map(String);
      const bodies = fd.getAll("topicBody").map(String);
      const topics = titles
        .map((t, i) => ({ title: t.trim(), body: (bodies[i] ?? "").trim() }))
        .filter((t) => t.title);
      await setContent("topics", topics as SiteContent["topics"]);
    } else if (key === "contact") {
      const value: Record<string, unknown> = {};
      for (const [k, v] of fd.entries()) {
        if (k.startsWith("__")) continue;
        value[k] = String(v);
      }
      value.prompts = str(fd, "prompts").split("\n").map((s) => s.trim()).filter(Boolean);
      await setContent("contact", value as SiteContent["contact"]);
    } else {
      const value: Record<string, string> = {};
      for (const [k, v] of fd.entries()) {
        if (k.startsWith("__")) continue;
        value[k] = String(v);
      }
      await setContent(key, value as never);
    }

    refreshPublic();
    revalidatePath("/admin/content");
    return { ok: "Saved successfully." };
  } catch (err: any) {
    console.error("[saveContent] Error:", err);
    return { error: err?.message || "Failed to save content. Please try again." };
  }
}

/* ------------------------------ messages ------------------------------ */

export async function markRead(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const m = await prisma.contactMessage.findUnique({ where: { id }, select: { read: true } });
  if (!m) return;
  await prisma.contactMessage.update({ where: { id }, data: { read: !m.read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/messages");
}
