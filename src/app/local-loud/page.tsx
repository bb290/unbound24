import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/site";
import { CheckList, H2, Label, Section } from "@/components/ui";

// Local + Loud: everything Unbound sells, on one page (2026-11-13).
// No "book a call" button, ever: the fit assessment goes here when it's built (Brittany, 2026-11-13: "skip assessment, we'll do that later").

export const metadata: Metadata = {
  title: "Local + Loud | Unbound24",
  description:
    "Your marketing department, done for you: a website that books jobs, a steady presence every week, and reviews on repeat. For local service businesses doing about $500K to $1M a year.",
};

const THREE = [
  {
    n: "01",
    fill: "bg-cyan",
    title: "A website that books jobs",
    body: "Custom built in your brand, with booking online as the main move on every page.",
    points: ["A page for every service and every town you serve", "Quizzes and instant price ranges that qualify leads for you", "Instant online booking", "FAQs that answer questions and filter out bad-fit leads", "New widgets and tools as you grow. You own it."],
  },
  {
    n: "02",
    fill: "bg-teal",
    title: "Show up every week",
    body: "Your real jobs, your crew, your town. Posted on schedule so people can see you're busy and you're good.",
    points: ["3 to 4 branded posts a week", "1 reel a week", "Made from your own job photos and videos", "We write, design, schedule and approve. You send photos."],
  },
  {
    n: "03",
    fill: "bg-lilac",
    title: "Reviews on repeat",
    body: "Every finished job asks how we did first. Happy customers go to Google. Unhappy ones come to you.",
    points: ["Feedback, then review requests, after every job", "A reply to every review, in your voice", "Every new review becomes a post", "Google Business Profile set up and kept active"],
  },
];

const CADENCE = [
  {
    when: "First 30 days",
    items: ["Comprehensive brand guide: who you serve, how you sound, how you look, what you stand for", "4 marketing campaigns planned around your seasons", "10 Canva templates in your brand, yours to keep", "Your custom website, built to book online", "Google profile, listings and review pipeline", "Notion SOPs for everything we do, open to you"],
  },
  { when: "Every week", items: ["3 to 4 branded posts", "1 reel", "A post for every new review", "A reply to every review"] },
  { when: "Every month", items: ["A new or better service or area page", "FAQ updates and SEO fixes", "New widgets and tools as needed", "A short results report"] },
  { when: "Every quarter", items: ["A fresh 90-day plan: priorities, campaigns, keywords and towns"] },
];

const PROOF = [
  {
    kind: "Roofing contractor · Oregon",
    name: "French Roofing",
    fill: "bg-teal",
    points: ["Custom website with an instant roof quote", "Branded posts and reels every week from real job photos", "Feedback and review requests after every job, and a post for every review"],
  },
  {
    kind: "Property management · Washington",
    name: "Sagareus",
    fill: "bg-lilac",
    points: ["800+ units across the Puget Sound", "Website with city pages and a steady blog", "Weekly social and review posts"],
  },
];

export default function LocalLoud() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/local-loud" />

      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-20 flex flex-col gap-6">
        <Label fill="bg-cyan">Local + Loud</Label>
        <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[16ch]">
          Your marketing department, <span className="torn bg-cyan">done for you.</span>
        </h1>
        <p className="text-[20px] leading-relaxed max-w-[58ch]">
          For local service businesses doing about $500K to $1M a year. A website that books jobs, a steady presence every week, and reviews on repeat. We build all three, run all three, and you keep doing the work you&apos;re known for.
        </p>
      </header>

      {/* Three things */}
      <Section tinted>
        <div className="flex flex-col gap-4 max-w-[62ch]">
          <H2>Three things. All of them.</H2>
          <p className="text-lg leading-relaxed text-muted">
            Most owners buy marketing in pieces: a website here, a social person there, a review app nobody runs. Local + Loud is the whole foundation, built to work together.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {THREE.map((c) => (
            <article key={c.n} className="lift flex flex-col gap-4 rounded-[20px] bg-surface border-2 border-border p-6">
              <span className={`grid place-items-center w-12 h-12 rounded-full border-2 border-border ${c.fill} text-ink font-mono font-medium`}>{c.n}</span>
              <h3 className="font-display font-bold text-[24px] leading-tight">{c.title}</h3>
              <p className="text-muted leading-relaxed">{c.body}</p>
              <CheckList items={c.points} className="mt-1" />
            </article>
          ))}
        </div>
      </Section>

      {/* What you get + price */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8">
            <H2>What you get.</H2>
            <p className="mt-3 text-muted">The first 30 days build everything. After that it runs every week, month and quarter.</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {CADENCE.map((c) => (
                <div key={c.when} className="flex flex-col gap-3">
                  <span className="label text-muted">{c.when}</span>
                  <CheckList items={c.items} />
                </div>
              ))}
            </div>
          </div>

          <div className="sticker rounded-[28px] bg-teal text-ink p-7 sm:p-8 flex flex-col gap-5 lg:rotate-1">
            <span className="label">One price. Everything.</span>
            <p className="font-display font-extrabold text-[64px] leading-none tracking-[-0.02em]">
              $4,000<span className="text-[22px] font-bold tracking-normal"> a month</span>
            </p>
            <ul className="flex flex-col gap-2 text-[15px] font-medium">
              <li>6-month minimum, then month to month.</li>
              <li>Onboarding included. No setup fee.</li>
              <li>You own your website and your content.</li>
              <li>We approve every post. Nothing waits on you.</li>
              <li>Ad spend not included.</li>
            </ul>
            <p className="text-[15px]">We take on a few clients at a time and go all in on each one.</p>
          </div>
        </div>
      </Section>

      {/* Who it's for */}
      <Section tinted>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-display font-bold text-[26px]">Who it&apos;s for</h3>
            <CheckList items={["Owner-operators of local service businesses: plumbers, roofers, electricians and the like", "A year or more in, already doing good work", "Want your brand to match the service you give your customers, your crew and your town"]} />
          </div>
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-display font-bold text-[26px]">Who it&apos;s not for</h3>
            <ul className="flex flex-col gap-2.5 text-[15px] text-muted">
              <li>Brand new businesses still figuring out what they do. We&apos;re not therapists.</li>
              <li>Anyone in it only for the money, with no care for the work or the people.</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Proof */}
      <Section id="proof">
        <div className="flex flex-col gap-4 max-w-[62ch]">
          <Label fill="bg-cyan">Proof</Label>
          <H2>Already running.</H2>
          <p className="text-lg leading-relaxed text-muted">Everything in Local + Loud runs today for businesses like yours.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PROOF.map((p) => (
            <article key={p.name} className="lift rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-4">
              <span className={`label self-start rounded-full ${p.fill} text-ink px-3 py-[7px]`}>{p.kind}</span>
              <h3 className="font-display font-extrabold text-[32px] leading-none">{p.name}</h3>
              <CheckList items={p.points} />
            </article>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
