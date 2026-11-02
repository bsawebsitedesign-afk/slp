"use client";

import { useState, useEffect } from "react";
import { inputCls, Label } from "./ui";

type Topic = { title: string; body: string };

const DEFAULT_TOPICS: Topic[] = [
  { title: "Physical Security", body: "The people, property, and critical assets side of the discipline—and the practitioners protecting them." },
  { title: "Electronic Security", body: "The systems and integrations that make modern protection work, from the people deploying them." },
  { title: "Cybersecurity", body: "Threats, defences and the leaders responding to a landscape that changes faster than ever." },
  { title: "Leadership & Strategy", body: "Business and leadership strategies, plus lessons learned directly from security executives." },
  { title: "Emerging Technology", body: "Breakthrough technologies and the innovations reshaping how the industry operates." },
  { title: "Trends & Breaking News", body: "Emerging trends and industry analysis, unpacked without the press-release language." },
];

export function TopicsEditor({ topics }: { topics: Topic[] }) {
  const getInitial = () => {
    const valid = (topics || []).filter((t) => t && typeof t.title === "string" && t.title.trim().length > 0);
    return valid.length > 0 ? valid : DEFAULT_TOPICS;
  };

  const [rows, setRows] = useState<Topic[]>(getInitial);

  useEffect(() => {
    const valid = (topics || []).filter((t) => t && typeof t.title === "string" && t.title.trim().length > 0);
    if (valid.length > 0) {
      setRows(valid);
    }
  }, [topics]);

  const update = (idx: number, field: keyof Topic, value: string) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const remove = (idx: number) => {
    setRows((prev) => {
      const filtered = prev.filter((_, j) => j !== idx);
      return filtered.length > 0 ? filtered : [{ title: "", body: "" }];
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    setRows((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="topics_json" value={JSON.stringify(rows)} />

      {rows.map((t, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-xl border border-steel/20 bg-ink-3/40 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-steel/15 pb-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-signal-bright">
              Topic #{i + 1} {t.title ? `— ${t.title}` : ""}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                title="Move up"
                className="rounded px-2 py-0.5 font-mono text-xs text-steel hover:text-bone disabled:opacity-30 disabled:hover:text-steel cursor-pointer"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === rows.length - 1}
                onClick={() => move(i, 1)}
                title="Move down"
                className="rounded px-2 py-0.5 font-mono text-xs text-steel hover:text-bone disabled:opacity-30 disabled:hover:text-steel cursor-pointer"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove topic ${i + 1}`}
                className="ml-2 font-mono text-[11px] uppercase tracking-widest text-red-400 hover:text-red-300 cursor-pointer"
              >
                ✕ Remove
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <label className="flex flex-col gap-1.5">
              <Label>Topic Title</Label>
              <input
                name="topicTitle"
                value={t.title}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="e.g. Physical Security"
                className={inputCls}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label>Topic Description / Body</Label>
              <textarea
                name="topicBody"
                rows={2}
                value={t.body}
                onChange={(e) => update(i, "body", e.target.value)}
                placeholder="Brief description of this area..."
                className={`${inputCls} resize-y`}
              />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows([...rows, { title: "", body: "" }])}
        className="w-fit cursor-pointer rounded-full border border-steel/25 bg-ink-2 px-5 py-2.5 font-mono text-xs tracking-wider text-bone uppercase hover:border-steel transition-colors"
      >
        + Add New Topic
      </button>
    </div>
  );
}
