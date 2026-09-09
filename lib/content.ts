import { prisma } from "./db";

/**
 * Every string below is verbatim (or a trimmed excerpt) from securityleaderpodcast.com
 * or the Business Security Alliance description of the show. Nothing here is invented.
 * These are only *defaults* — the admin overrides any of them from /admin/content.
 */
export const DEFAULTS = {
  hero: {
    eyebrow: "HOSTED BY THE BUSINESS SECURITY ALLIANCE",
    headlineLead: "Where the World's",
    headlineEmphasis: "Security Leaders",
    headlineTail: "Speak",
    intro:
      "The only podcast in the world dedicated to bringing you unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity.",
    primaryCtaLabel: "Watch the Latest",
    secondaryCtaLabel: "Explore Episodes",
  },
  about: {
    // "Who we are" — securityleaderpodcast.com
    whoTitle: "Who we are",
    whoBody:
      "The Security Leader Podcast is the only podcast in the world dedicated to bringing you unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity. We go beyond theory and headlines to deliver real conversations, real experience, and real insight from those building, securing, and transforming the global security ecosystem.\n\nHosted by the Business Security Alliance, the podcast delivers bold ideas, emerging trends, leadership lessons, and breakthrough technologies—straight from the experts who are defining what's next. Our mission is simple: to educate, connect, and empower the security leaders of today and tomorrow through the most engaging and impactful content in the industry.\n\nIf you live and breathe security, this is your community—and this is your podcast.",
    // "What we do"
    whatTitle: "What we do",
    whatBody:
      "On The Security Leader Podcast, we explore the full spectrum of security—from breaking news and emerging trends to deep, candid conversations with some of the most interesting and influential people in the world of Physical, Electronic, and Cybersecurity.\n\nEach episode is designed to inform, challenge, and inspire. We unpack real-world security challenges, spotlight innovative technologies, examine business and leadership strategies, and share lessons learned directly from the executives, practitioners, and visionaries shaping the future of our industry.\n\nWe pride ourselves on delivering content that is not only informative, but genuinely engaging. Our conversations go beyond surface-level commentary, offering practical insights, authentic stories, and expert perspectives our listeners can apply immediately—whether they're protecting organizations, building companies, or advancing their careers.\n\nFrom high-level industry analysis to in-depth interviews, The Security Leader Podcast delivers trusted, thought-provoking content that keeps security professionals informed, connected, and ahead of what's next.",
    // "Why listen to us"
    whyTitle: "Why listen to us",
    whyPull: "Because security is changing faster than ever—and the people shaping its future are right here.",
    whyBody:
      "The Security Leader Podcast gives you direct access to the voices that matter most in Physical, Electronic, and Cybersecurity. Hosted by security professionals who live this industry every day, we deliver real conversations with real leaders—sharing insights you won't find in press releases, product brochures, or surface-level discussions.\n\nWhen you listen, you stay informed on the latest trends, technologies, and threats. You gain practical lessons from executives, innovators, and practitioners who are solving real-world security challenges. And you become part of a community that values experience, leadership, and forward-thinking ideas.\n\nThis podcast isn't just about keeping up—it's about staying ahead.",
    closing:
      "If you care about protecting people, property, and critical assets—and want to learn directly from those defining what's next—this is the podcast for you.",
    mission:
      "To educate, connect, and empower the security leaders of today and tomorrow through the most engaging and impactful content in the industry.",
  },
  /** Every topic below is named explicitly in the show's own "What we do" copy. */
  topics: [
    { title: "Physical Security", body: "The people, property, and critical assets side of the discipline—and the practitioners protecting them." },
    { title: "Electronic Security", body: "The systems and integrations that make modern protection work, from the people deploying them." },
    { title: "Cybersecurity", body: "Threats, defences and the leaders responding to a landscape that changes faster than ever." },
    { title: "Leadership & Strategy", body: "Business and leadership strategies, plus lessons learned directly from security executives." },
    { title: "Emerging Technology", body: "Breakthrough technologies and the innovations reshaping how the industry operates." },
    { title: "Trends & Breaking News", body: "Emerging trends and industry analysis, unpacked without the press-release language." },
  ],
  contact: {
    title: "Get in touch",
    intro: "Guest pitches, topic suggestions, partnerships—reach the show directly.",
    guestEmail: "info@securityleaderpodcast.com",
    generalEmail: "info@securityleaderpodcast.com",
    youtubeUrl: "https://www.youtube.com/channel/UCVTgPtlFP9KvDbnoFQzHTFg",
    allianceUrl: "https://businesssecurityalliance.com/",
    prompts: [
      "I want to be a guest on the podcast",
      "Tell us what topics you want to hear on the podcast",
    ],
  },
  seo: {
    title: "Security Leader Podcast — Where the World's Security Leaders Speak",
    description:
      "Unfiltered industry perspectives from the most influential thought leaders shaping the future of Physical, Electronic, and Cybersecurity. Hosted by the Business Security Alliance.",
    ogImage: "/brand/podcast-hosts-art.png",
  },
  members: [
    {
      id: "member-grace",
      name: "Grace Risbon",
      role: "Regional Sales Manager, Salient Systems",
      photo: "/brand/grace.webp",
      bio: "Rising leader in physical security, AI-enabled video surveillance, enterprise technology, and zero-trust security.",
      fullBio:
        "Grace Risbon is a rising leader in the physical security industry and Regional Sales Manager for the Mid-Atlantic Region at Salient Systems, a leading provider of enterprise-class video management solutions.\n\nSpecializing in AI-enabled video surveillance, enterprise security technology, and channel development, Grace works closely with security integrators, technology partners, and end users to solve complex operational challenges and build security programs capable of evolving with emerging threats. Her approach combines technical knowledge with a relationship-driven sales philosophy focused on delivering measurable value rather than simply selling products.\n\nGrace is also an active contributor to important industry conversations surrounding zero-trust security, the convergence of physical and cybersecurity, artificial intelligence, video analytics, license plate recognition, and the future of enterprise security platforms. She has earned multiple technical and sales certifications, received recognition for her sales performance, and continues to distinguish herself through her energy, discipline, and commitment to professional growth.\n\nKnown for exceeding expectations and building trusted relationships, Grace represents a new generation of security professionals helping organizations transform video surveillance from a traditional recording system into a powerful source of intelligence, awareness, and better decision-making.",
      linkedinUrl: "https://www.linkedin.com/in/grace-risbon-090527234/",
      tag: "Host",
      objectPosition: "50% 15%",
      zoom: 100,
    },
    {
      id: "member-katie",
      name: "Katie Munoz",
      role: "Federal Account Executive & Tech Leader",
      photo: "/brand/katie.webp",
      bio: "Federal technology, cybersecurity, data management, and operational resilience leader, advocating for Women in STEM.",
      fullBio:
        "Katie Munoz is an accomplished technology sales and business-development leader with extensive experience helping federal agencies address complex challenges involving data management, cybersecurity, digital modernization, and operational resilience. Throughout her career, Kate has earned a reputation for building trusted relationships, understanding her customers’ missions, and connecting government leaders with technologies that deliver meaningful, measurable outcomes.\n\nKate’s professional journey includes her current role as a Federal Account Executive at Everpure, a data storage and management platform that helps Government and Commercial businesses store, organize, and protect computer files, and leadership roles at Cohesity and Hewlett Packard Enterprise, where she worked across the federal technology marketplace. At Cohesity, she supported government organizations seeking to protect mission-critical information, strengthen cyber resilience, and defend against the rapidly evolving threat of ransomware. Her experience gives her valuable insight into why data has become one of an organization’s most vulnerable—and most vulnerable—strategic assets.\n\nBefore joining Cohesity, Kate spent six years with Hewlett Packard Enterprise, advancing through several federal sales and account-management positions. Her responsibilities included supporting the U.S. Department of Commerce and its agencies, developing strategic enterprise accounts, and collaborating with federal partners and systems integrators. This combination of direct customer engagement, partner development, and enterprise technology experience gave Kate a comprehensive understanding of how government agencies evaluate, acquire, and implement technology.\n\nHer work extends beyond selling products. Kate understands that federal technology decisions directly affect national missions, public services, organizational continuity, and the security of sensitive government information. She approaches each customer relationship by first understanding the mission, identifying the underlying operational challenge, and then helping assemble the people, partners, and technologies needed to solve it.\n\nKate has also played an active role in the Washington, D.C., federal technology community through her involvement with AFCEA DC. As a host of the AFCEA DC Emerging Leaders Podcast, she has interviewed senior government and industry executives about leadership, innovation, public service, and the changing technology landscape. Her guests have included influential leaders such as the chief technology officer of the National Oceanic and Atmospheric Administration, giving listeners direct access to the people responsible for modernizing and protecting critical government operations.\n\nIn addition to her professional accomplishments, Kate is a passionate advocate for mentorship, resilience, and creating greater opportunities for women in technology. She has spoken with students about careers in STEM, the importance of internships and professional mentors, and the realities of building a successful career in a traditionally male-dominated industry. Her message is direct and practical: failure is not the opposite of success—it is often an essential part of achieving it.\n\nA graduate of Bradley University, Kate combines business acumen, federal market knowledge, cybersecurity awareness, and an authentic passion for helping others grow. She represents a new generation of technology leaders who understand that success is built not only through innovation, but also through trust, collaboration, perseverance, and a genuine commitment to the customer’s mission.\n\nOn the Podcast, Kate shares the lessons that have shaped her professional journey, the evolving cybersecurity and ransomware threats facing government organizations, and what technology companies must do to earn trust in the federal marketplace. She also discusses mentorship, women in STEM, professional resilience, and the leadership principles that have helped her turn challenges into opportunities.",
      linkedinUrl: "https://www.linkedin.com/in/katie-munoz34",
      tag: "Co-Host",
      objectPosition: "50% 15%",
      zoom: 100,
    },
    {
      id: "member-ken",
      name: "Ken Kocher",
      role: "Founder & Host, Executive Director",
      photo: "/brand/ken.webp",
      bio: "Nationally recognized security industry executive, entrepreneur, former law enforcement officer, and founder of SLP.",
      fullBio:
        "Ken Kocher is a nationally recognized security industry executive, entrepreneur, former law enforcement officer, and trusted government security advisor with more than four decades of experience spanning physical security, electronic security, business leadership, risk management, and advanced security technology.\n\nAs the founder and host of The Security Leader Podcast, Ken brings listeners something increasingly rare: an honest, practical perspective built through firsthand experience at nearly every level of the security profession. His career has taken him from the streets as a police officer to some of the nation’s most secure government facilities, the executive office of a successful security integration company, and ultimately the manufacturing side of the industry. That journey gives him a distinctive ability to understand security from the viewpoints of the practitioner, customer, integrator, manufacturer, business owner, and government decision-maker.\n\nKen began his career in law enforcement in Montgomery County, Maryland. His years as a police officer gave him an enduring understanding of risk, leadership, accountability, and the human consequences of security decisions. After leaving law enforcement, he worked in retail security and later joined Science Applications International Corporation, one of the country’s largest government contractors. At SAIC, Ken conducted security risk assessments and provided consulting and electronic security recommendations to state and federal agencies responsible for protecting highly sensitive facilities, personnel, and operations.\n\nIn 2003, Ken founded Force Security Solutions in the Washington, D.C., metropolitan area. Over the next two decades, he built the company into an award-winning managed security services provider and systems integrator serving commercial, government, and enterprise customers. Under his leadership, Force Security designed and implemented comprehensive intrusion detection, access control, video surveillance, monitoring, and managed-service solutions customized around each customer’s risks, operational requirements, and long-term security objectives.\n\nKen built Force Security around a simple but powerful principle: security companies should stop selling boxes and start solving problems. That philosophy helped the company develop lasting customer relationships, introduce emerging IP and cloud-based technologies, and earn multiple industry awards for innovation, growth, and performance. Force Security received several honors from MOBOTIX, including New Installer of the Year, Growth Strategy of the Year, Partner of the Year, and a Global Excellence Award.\n\nIn August 2023, Force Security Solutions was acquired by Konica Minolta Business Solutions U.S.A. The acquisition validated the company, culture, and customer-focused business model Ken had spent more than 20 years building. Following the transaction, he continued contributing executive leadership and industry expertise as Force became part of Konica Minolta’s expanding video security and managed-services portfolio.\n\nToday, Ken serves as Executive Director of Government Solutions for Digital Monitoring Products. In this role, he works with security dealers, systems integrators, technology partners, consultants, and government agencies to expand the use of advanced intrusion detection, access control, communications, and integrated security solutions throughout the public sector. His work focuses on helping partners navigate the demanding operational, technical, and regulatory requirements of federal, state, and local government security environments.\n\nKen’s leadership extends beyond his corporate responsibilities. He has served on the Board of Directors of the Foundation for Advancing Security Talent, an organization created by the Security Industry Association and the Electronic Security Association to attract, educate, and develop the next generation of security professionals. He has also served as chairman of the Security Industry Association’s National Capital Region Security Forum, helping connect government security leaders, integrators, manufacturers, and practitioners throughout the Washington, D.C., region.\n\nThroughout his career, Ken has remained passionate about developing people, strengthening the security profession, and creating opportunities for the next generation of leaders. He believes the industry’s future depends not only on better technology, but also on stronger leadership, practical education, trusted partnerships, and a willingness to have honest conversations about what works, what fails, and what must change.\n\nKen created The Security Leader Podcast to host those conversations. Through candid interviews with executives, entrepreneurs, government officials, manufacturers, integrators, technology innovators, and frontline security professionals, the podcast explores the decisions, challenges, failures, and breakthroughs shaping the future of physical, electronic, and cybersecurity.\n\nRather than offering rehearsed sales pitches or surface-level commentary, Ken draws upon more than 40 years of operational, technical, and business experience to ask the questions that security leaders genuinely want answered. His conversations examine emerging technology, government and critical-infrastructure protection, cyber-physical convergence, business growth, leadership, workforce development, mergers and acquisitions, and the realities of building a successful career in the security industry.\n\nThe Security Leader Podcast is where experience meets innovation—and where the people responsible for protecting organizations, communities, and the nation share the lessons that others can use to lead, grow, and make better decisions.",
      linkedinUrl: "https://www.linkedin.com/in/kenkocher",
      tag: "Host",
      objectPosition: "50% 15%",
      zoom: 100,
    },
    {
      id: "member-oz",
      name: "Ozzie Koçak",
      role: "Director of Marketing & Communications",
      photo: "/brand/oz.webp",
      bio: "Accomplished marketing and communications leader in defense, integrated security, C5ISR, and executive podcasting.",
      fullBio:
        "Ozzie Koçak is an accomplished marketing and communications leader whose career spans the defense, integrated security, C5ISR, and professional association sectors. She specializes in transforming complex technologies and technical capabilities into clear, compelling narratives that strengthen brands, engage target audiences, and support sustainable business growth.\n\nAs Director of Marketing and Communications for Active Security Consulting, Özge leads strategic initiatives designed to elevate the company’s market presence and communicate its expertise across the defense and security communities. Her work includes brand strategy, digital marketing, corporate communications, content development, industry engagement, and business-growth initiatives. By connecting an organization’s technical capabilities with the real-world challenges facing its customers, she helps ensure that marketing becomes a meaningful driver of credibility, relationships, and opportunity.\n\nBefore joining Active Security Consulting, Özge held a senior marketing position with the Security Industry Association, one of the leading trade associations representing the global security industry. In that role, she supported marketing programs, industry events, member engagement, and communications that connected security professionals with emerging technologies, market intelligence, educational resources, and influential industry leaders. This experience gave her a broad perspective on the forces shaping the security marketplace and the critical role that communication, collaboration, and professional communities play in advancing the industry.\n\nA graduate of Marymount University with a background in politics and global studies, Özge brings an international perspective to her work. Her multicultural experience and ability to communicate across technical, executive, and professional audiences allow her to build connections between organizations, industries, and ideas. She understands that successful marketing—particularly in defense and security—requires more than visibility. It requires credibility, trust, a strong understanding of the customer’s mission, and the ability to communicate value with clarity.\n\nOzzie represents a new generation of leaders helping defense and security organizations modernize how they position themselves, engage their markets, and tell their stories. Her combination of strategic thinking, industry knowledge, creative communication, and relationship-building provides a valuable perspective on marketing complex solutions, building trusted brands, connecting with today’s security decision-makers, and turning innovative ideas into measurable business growth.\n\nOn the Security Leader Podcast, Ozzie shares her insights from her professional journey, the lessons she has learned while working across the security industry, and her perspective on what it takes to stand out in an increasingly competitive and technology-driven marketplace.",
      linkedinUrl: "https://www.linkedin.com/in/ozge-kocak/",
      tag: "Producer",
      objectPosition: "50% 15%",
      zoom: 100,
    },
  ],
};

export type SiteContent = typeof DEFAULTS;
export type ContentKey = keyof SiteContent;

/** Reads one content group, falling back to the verbatim defaults above. */
export async function getContent<K extends ContentKey>(key: K): Promise<SiteContent[K]> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) return DEFAULTS[key];
    if (Array.isArray(DEFAULTS[key])) {
      const dbArr = (row.value as any[]) || [];
      const defaultArr = DEFAULTS[key] as any[];
      return dbArr.map((dbItem: any, idx: number) => {
        const dbNameLower = (dbItem.name || "").toLowerCase();
        const dbIdLower = (dbItem.id || "").toLowerCase();

        const defaultItem = defaultArr.find((d: any) => {
          const dId = (d.id || "").toLowerCase();
          const dName = (d.name || "").toLowerCase();
          if (dbIdLower && dId && dbIdLower === dId) return true;
          if (dbIdLower.includes("oz") && dId.includes("oz")) return true;
          if (dbIdLower.includes("ken") && dId.includes("ken")) return true;
          if (dbIdLower.includes("grace") && dId.includes("grace")) return true;
          if (dbIdLower.includes("katie") && dId.includes("katie")) return true;
          if (dbNameLower.includes("oz") && dName.includes("oz")) return true;
          if (dbNameLower.includes("ken") && dName.includes("ken")) return true;
          if (dbNameLower.includes("grace") && dName.includes("grace")) return true;
          if (dbNameLower.includes("katie") && dName.includes("katie")) return true;
          return false;
        }) || defaultArr[idx] || {};

        return {
          ...defaultItem,
          ...dbItem,
          name: defaultItem.name || dbItem.name,
          role: defaultItem.role || dbItem.role,
          fullBio: defaultItem.fullBio || dbItem.fullBio || "",
          linkedinUrl: defaultItem.linkedinUrl || dbItem.linkedinUrl || "",
        };
      }) as unknown as SiteContent[K];
    }
    return ({ ...DEFAULTS[key], ...(row.value as object) } as SiteContent[K]);
  } catch (e) {
    console.warn(`[getContent] Database lookup failed for key "${key}", falling back to DEFAULTS.`, e);
    return DEFAULTS[key];
  }
}

export async function setContent<K extends ContentKey>(key: K, value: SiteContent[K]) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
}
