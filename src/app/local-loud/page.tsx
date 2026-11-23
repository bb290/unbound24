import type { Metadata } from "next";
import { BrandGuideWidget } from "@/components/brand-guide/BrandGuideWidget";
import { StartGuideLink } from "@/components/brand-guide/StartGuideLink";
import { LoudFlywheel } from "@/components/LoudFlywheel";
import { SiteFooter, SiteNav } from "@/components/site";
import { Check, CheckList, Cross, H2, Section } from "@/components/ui";

// Local + Loud (rebuilt 2026-11-17 from Brittany's comment rounds, live the same day): matches /websites, same call to
// action (every button starts the brand guide -> Submit for Mock Up), results first, Just Take the Pics, the CODE
// flywheel (LoudFlywheel), Deliverables, then Try Before You Buy. The old page is in git (commit 07c1b08).

export const metadata: Metadata = {
  title: "Local + Loud | Unbound24",
  description:
    "Local & Loud: a home services online marketing campaign. Get found online, build trust and book prequalified appointments: your website, social posts and reviews, run for you. Try before you buy with a free mock up.",
  alternates: { canonical: "/local-loud" },
  openGraph: { url: "/local-loud", images: [{ url: "/og/local-loud.png?v=2", width: 1200, height: 630, alt: "Local + Loud" }] },
};

const PHOTO_STEPS = [
  { title: "Snap it on the job", body: "Before, during and after. Photos or quick videos, the way you already do (or should be!)", fill: "bg-lilac", icon: "camera" },
  { title: "We pull it in", body: "Directly from the apps you already use, like Housecall Pro, ServiceTitan, Google Drive (to name a few).", fill: "bg-cyan", icon: "pull" },
  { title: "Create Content", body: "Posts, reels, blogs, FAQs, gallery, case studies, etc.", fill: "bg-teal", icon: "megaphone" },
  { title: "Trust Increased", body: "Higher Google & AI rankings generate qualified leads.", fill: "bg-[#FFFDF8]", icon: "growth" },
  { title: "Questions? Answered.", body: "Site answers FAQs + basic pricing. Appointments booked online.", fill: "bg-lilac", icon: "calendar" },
];

// Step icons instead of numbers (Brittany, 2026-11-17).
function StepIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    camera: <><path d="M5 12h5l2.5-3.5h7L22 12h5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" /><circle cx="16" cy="19" r="4.5" /></>,
    pull: <><path d="M16 4v15" /><path d="M10 13l6 6 6-6" /><path d="M5 22v4a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-4" /></>,
    megaphone: <><path d="M4 13v6h4l11 6V7L8 13H4z" /><path d="M23 12.5a5 5 0 0 1 0 7" /><path d="M8 19l2 7h3l-1.5-6.2" /></>,
    growth: <><path d="M4 4v24h24" /><path d="M8 22l6-6 4 4 9-10" /><path d="M21 10h6v6" /></>,
    calendar: <><rect x="4" y="6" width="24" height="22" rx="3" /><path d="M4 12h24" /><path d="M10 3v6M22 3v6" /><path d="M11 20l3.5 3.5L21 17" /></>,
  };
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
  );
}

const DELIVERABLES = [
  { when: "Onboarding", fill: "bg-cyan", items: ["Comprehensive brand guide", "4 marketing campaigns", "10 Canva custom templates", "Custom website, built to book online", "Close out procedures", "Automated asset flow structure", "SEO/AEO strategy", "Notion SOPs for everything"] },
  { when: "Monthly", fill: "bg-teal", items: ["12 to 16 branded posts x 4 channels", "4-6 reels / shorts 5 channels", "Reply to every review", "Google My Business audit", "8 website updates: FAQs, SEO/AEO, Gallery", "4 blog posts"] },
  { when: "Quarterly", fill: "bg-lilac", items: ["1-2 new site widgets", "Social audit", "Free download asset added"] },
];

export default function LocalLoud() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/local-loud" />

      {/* Hero, built like the Website Dev hero. Bullets are Claude's draft. */}
      {/* Headline + subheader, centered (Brittany, 2026-11-18 comment) */}
      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-20 flex flex-col items-center text-center gap-7">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px]">
            Local &amp; <span className="torn bg-cyan">Loud</span>
          </h1>
          <p className="font-display font-bold text-[20px] leading-snug sm:text-[26px] text-muted max-w-[32ch]">Home Services Online Marketing Campaign</p>
        </div>
        {/* VSL placeholder (Brittany, 2026-11-18): swap for the video embed when it's recorded. Same style as the home intro video. */}
        <div className="sticker rounded-[28px] bg-surface-2 aspect-video w-full max-w-[880px] grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <span className="grid place-items-center w-16 h-16 rounded-full bg-cyan border-2 border-border text-ink" aria-hidden="true">
              <svg viewBox="0 0 20 20" className="w-7 h-7 ml-1"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
            </span>
            <span className="label text-muted">Video coming soon</span>
          </div>
        </div>
        {/* Checks on the first line, crosses on the next (Brittany, 2026-11-18) */}
        <div className="flex flex-col items-start gap-3 text-[20px] font-bold whitespace-nowrap sm:items-center" aria-label="What you get">
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
            <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Get found online</li>
            <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Build trust online</li>
            <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Book prequalified appts</li>
          </ul>
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
            <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No posting it yourself</li>
            <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No chasing reviews</li>
          </ul>
        </div>
        <StartGuideLink className="btn btn-cta self-center">Get Free Mock Up</StartGuideLink>
      </header>

      {/* The cycle */}
      <Section id="cycle" tinted>
        <div className="flex flex-col gap-3 items-center text-center mb-12">
          <H2>Local + Loud Loop</H2>
          <p className="text-lg leading-relaxed text-muted max-w-[52ch]">Work creates content. Content creates work.</p>
        </div>
        <LoudFlywheel />
      </Section>

      {/* Who it's for: above Just Take the Pics (Brittany, 2026-11-18) */}
      <Section id="fit">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-display font-bold text-[26px] text-center">Who it&apos;s for</h3>
            <CheckList itemClass="text-[16px]" items={["Owner operators of local service based businesses", "1+ year in business", "$750k+ Gross Revenue / year"]} />
          </div>
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-4">
            <h3 className="font-display font-bold text-[26px] text-center">Who it&apos;s not for</h3>
            <ul className="flex flex-col gap-2.5 text-[16px]">
              <li className="flex gap-2.5 leading-snug"><Cross />Brand new businesses still figuring out what they do</li>
              <li className="flex gap-2.5 leading-snug"><Cross />Operators who don&apos;t care about their customers, employees or the quality of their service</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Photos and videos, the easy way (Brittany, 2026-11-17: emphasize how we simplify photo/video sharing) */}
      <Section id="photos" tinted>
        <div className="flex flex-col gap-3 items-center text-center mb-12">
          <H2>Just Take the Pics</H2>
        </div>
        <ol className="grid gap-6 md:grid-cols-6">
          {PHOTO_STEPS.map((p, i) => (
            <li key={p.title} className={`sticker rounded-[24px] ${p.fill} text-ink p-6 sm:p-7 flex flex-col items-center text-center gap-3 ${i < 3 ? "md:col-span-2" : "md:col-span-3"}`}>
              <span className="grid place-items-center w-14 h-14 rounded-full border-2 border-ink bg-[#FFFDF8] text-ink"><StepIcon name={p.icon} /><span className="sr-only">Step {i + 1}</span></span>
              <h3 className="font-display font-extrabold text-[26px] leading-tight">{p.title}</h3>
              <p className="text-[17px] leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>


      {/* Brand guide: where the mock-up lead comes from */}
      {/* No intro box here (Brittany, 2026-11-18): the section stays hidden until a mock-up button opens the guide. */}
      <section id="brand-guide" className="scroll-mt-20 border-t-2 border-border bg-surface-2 [&:not(:has([data-bg-widget]))]:hidden">
        <div className="max-w-[1200px] mx-auto px-4 py-16 sm:px-8 sm:py-24">
          <div className="max-w-[820px] mx-auto">
            <BrandGuideWidget variant="websites" introless />
          </div>
        </div>
      </section>


      {/* Deliverables (Brittany, 2026-11-17), just above the closer. Her wording. */}
      {/* The $4,000 card floats over the Deliverables box's bottom-right corner (Brittany, 2026-11-18: purple). */}
      <Section id="deliverables">
        <div className="relative lg:mb-14">
        <div className="rounded-[24px] bg-surface border-2 border-border p-6 pb-12 sm:p-10 sm:pb-14 lg:pb-16 flex flex-col gap-8">
          <div className="flex flex-col gap-3 items-center text-center">
            <H2>Deliverables</H2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {DELIVERABLES.map((d) => (
              <div key={d.when} className="flex flex-col gap-3">
                <span className={`label self-start rounded-full border-2 border-ink ${d.fill} text-ink px-3 py-[7px]`}>{d.when}</span>
                <CheckList items={d.items} itemClass="text-[16px]" />
              </div>
            ))}
          </div>
        </div>
        <div id="package" className="sticker rounded-[28px] bg-lilac text-ink p-7 sm:p-8 flex flex-col items-center text-center gap-5 max-w-[360px] mx-auto -mt-6 relative rotate-1 lg:absolute lg:mt-0 lg:-right-6 lg:-bottom-16 lg:w-[340px] lg:rotate-2">
          <span className="label">Monthly Flat Fee</span>
          <p className="font-display font-extrabold text-[64px] leading-none tracking-[-0.02em]">
            $4,000
          </p>
          <StartGuideLink className="btn btn-cta">See a free mock up first</StartGuideLink>
        </div>
        </div>
      </Section>

      {/* The one ask: the free mock up */}
      <Section>
        <div className="float-gentle sticker rounded-[28px] bg-cyan text-ink p-7 sm:p-12 flex flex-col gap-5 items-center text-center">
          <span className="label">Risk Free</span>
          <h2 className="font-display font-extrabold whitespace-nowrap text-[clamp(24px,7vw,64px)] leading-[1.02] tracking-[-0.01em]">Try Before You Buy</h2>
          <p className="text-[20px] font-bold">What are you waiting for?</p>
          <StartGuideLink className="btn btn-cta">Get Free Mock Up</StartGuideLink>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
