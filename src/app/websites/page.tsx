import type { Metadata } from "next";
import { BrandGuideWidget } from "@/components/brand-guide/BrandGuideWidget";
import { StartGuideLink } from "@/components/brand-guide/StartGuideLink";
import { SiteFooter, SiteNav } from "@/components/site";
import { SitesBuilt } from "@/components/SitesBuilt";
import { Check, CheckList, Cross, H2, Section } from "@/components/ui";
import { BeforeAfterDemo, FreeDownloadDemo, ReviewCarouselDemo, RoofEstimateDemo, WebsiteCheckDemo } from "@/components/website-demos";

// Website Dev (Brittany, 2026-11-17): the second service under Services, next to Local + Loud.
// The page's ONLY goal is the website mock-up lead (brand guide -> Submit for Mock Up): every call to action starts the
// brand guide (StartGuideLink). No links back to the home page, no Local + Loud pitch, no "book a call".
// Order after Brittany's comments (2026-11-17): hero -> "It's a Vibe" + Upfront $1,000 -> brand guide -> custom
// components ($250 each box; each category beside its samples) -> Try Before You Buy.

export const metadata: Metadata = {
  title: "Website Dev | Unbound24",
  description:
    "A website that books jobs: six pages in your brand, connected to online booking, handed over for you to own. $1,000. Try before you buy with a free mock up.",
  alternates: { canonical: "/websites" },
  openGraph: { url: "/websites", images: [{ url: "/og/websites.png?v=3", width: 1200, height: 630, alt: "Website Dev" }] },
};

const PAGES = ["Home", "Services", "About", "Reviews", "Gallery", "Pricing"];

const PREQUALIFYING = [
  { name: "Instant estimate", what: "a price range in seconds" },
  { name: "Assessment", what: "a short quiz that scores fit or need" },
  { name: "Reflection", what: "questions that help visitors think through what they need" },
  { name: "Service area check", what: "do you cover their town?" },
];
const RAZZLE = [
  { name: "Social feeds", what: "your latest posts, live on your site" },
  { name: "Before/after sliders", what: "show the job, not just tell it" },
  { name: "Review walls", what: "your best reviews, always fresh" },
  { name: "Little games", what: "spinners and quizzes people click just for fun" },
];
// Short enough to stay on one line on a phone (Brittany, 2026-11-17).
const DOWNLOADS = [
  { name: "Guides", what: "before-you-hire tips" },
  { name: "Checklists", what: "seasonal upkeep" },
  { name: "Price sheets", what: "common job costs" },
  { name: "Calendars", what: "when to do what" },
];

// Custom component types, all in one box that matches "It's a Vibe" (Brittany, 2026-11-18). Each type gets its
// color as a label, so it still reads differently from the white sample cards below.
const COMPONENT_TYPES = [
  { title: "Qualify Leads", fill: "bg-cyan", body: "Sort the real jobs from the tire kickers before anyone books.", examples: PREQUALIFYING },
  { title: "Razzle Dazzle", fill: "bg-teal", body: "The fun stuff that makes people stay, scroll and remember you.", examples: RAZZLE },
  { title: "Free Downloads", fill: "bg-lilac", body: "Give away something useful and get remembered.", examples: DOWNLOADS },
];

export default function Websites() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/websites" />

      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-20 flex flex-col gap-7">
        <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[16ch]">
          A website that <span className="torn bg-cyan">books jobs</span>
        </h1>
        <ul className="flex flex-col gap-3 text-[20px] font-bold whitespace-nowrap sm:flex-row sm:flex-wrap sm:gap-x-8" aria-label="What you get">
          <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No templates</li>
          <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No stock photos</li>
          <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Branded</li>
          <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Optimized</li>
        </ul>
        <StartGuideLink className="btn btn-cta self-start">Get Free Mock Up</StartGuideLink>
      </header>

      {/* The website and its price */}
      <Section id="branded" tinted>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <H2>It&apos;s a Vibe</H2>
              <p className="text-lg leading-relaxed text-muted max-w-[52ch]">6 page website built to book.<br />Your colors, voice, &amp; visuals.</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Pages included">
              {PAGES.map((p) => (
                <li key={p} className="rounded-2xl border-2 border-border bg-background px-4 py-3 font-display font-bold text-[20px] text-center">{p}</li>
              ))}
            </ul>
            <CheckList
              itemClass="text-[17px]"
              items={[
                "Connected to your online booking",
                "Built from your brand guide, designed for mobile, tablets and desktops",
                "No gatekeeping: we build it + hand it over",
                "Edit it yourself by asking your own AI agent",
                "Detailed Instructions Included",
              ]}
            />
            <SitesBuilt />
          </div>

          <div className="sticker rounded-[28px] bg-teal text-ink p-7 sm:p-8 flex flex-col items-center text-center gap-5 lg:rotate-1">
            <span className="label">Flat Fee</span>
            <p className="font-display font-extrabold text-[64px] leading-none tracking-[-0.02em]">$1,000</p>
            <StartGuideLink className="btn btn-cta">See a free mock up first</StartGuideLink>
          </div>
        </div>
      </Section>

      {/* Brand guide: where the mock-up lead comes from */}
      <Section id="brand-guide">
        <div className="max-w-[820px] mx-auto">
          <BrandGuideWidget variant="websites" />
        </div>
      </Section>

      {/* Custom components */}
      <Section id="add-ons" tinted>
        {/* Second hero, matching the top one (Brittany, 2026-11-17). Bullets are Claude's draft. */}
        <div className="flex flex-col gap-7 mb-14">
          <h2 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[16ch]">
            Optimized + <span className="torn bg-lilac">Customized</span>
          </h2>
          <ul className="flex flex-col gap-3 text-[20px] font-bold whitespace-nowrap sm:flex-row sm:flex-wrap sm:gap-x-8" aria-label="What custom components are">
            <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No cookie-cutter widgets</li>
            <li className="flex items-center gap-2.5"><Cross className="w-6 h-6" />No fluff</li>
            <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Built for your business</li>
            <li className="flex items-center gap-2.5"><Check className="w-6 h-6" />Sorts the tire kickers</li>
          </ul>
        </div>
        {/* Box + price card side by side, like "It's a Vibe" + Flat Fee above; samples below in 2 columns (Brittany, 2026-11-18). */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
          <div className="rounded-[20px] bg-surface border-2 border-border p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-center text-center">
              <H2>Custom Components</H2>
              <p className="text-lg leading-relaxed text-muted max-w-[52ch]">Add now or later (or never).</p>
            </div>
            {COMPONENT_TYPES.map((c) => (
              <div key={c.title} className="rounded-2xl border-2 border-border bg-background p-4 sm:p-5 flex flex-col gap-3">
                <h3 className={`self-start rounded-full border-2 border-ink ${c.fill} text-ink px-4 py-1 font-display font-extrabold text-[22px] leading-tight`}>{c.title}</h3>
                <p className="leading-relaxed text-[17px]">{c.body}</p>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {c.examples.map((e) => (
                    <li key={e.name} className="flex gap-2.5 text-[16px] leading-snug">
                      <Check />
                      <span><span className="font-bold">{e.name}:</span>{" "}<span className="text-muted">{e.what}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Price card, then the website check sample under it (Brittany, 2026-11-18). */}
          <div className="flex flex-col gap-10">
            {/* Price card matches the Flat Fee one: label, price, button (Brittany, 2026-11-17). */}
            <div className="sticker rounded-[28px] bg-lilac text-ink p-7 sm:p-8 flex flex-col items-center text-center gap-5 lg:-rotate-1">
              <span className="label">Add Ons</span>
              <p className="font-display font-extrabold text-[64px] leading-none tracking-[-0.02em]">
                $250<span className="text-[22px] font-bold tracking-normal"> each</span>
              </p>
              <StartGuideLink className="btn btn-cta">See a free mock up first</StartGuideLink>
            </div>
            <WebsiteCheckDemo />
          </div>
        </div>

        {/* Samples, 2 columns */}
        <div className="mt-14 columns-1 gap-6 lg:columns-2 [&>*]:mb-8 [&>*]:break-inside-avoid">
          <RoofEstimateDemo />
          <ReviewCarouselDemo />
          <BeforeAfterDemo />
          <FreeDownloadDemo />
        </div>
      </Section>

      {/* The one ask: the free mock up. The last chance to convert, so it moves gently (Brittany, 2026-11-17). */}
      <Section>
        <div className="float-gentle sticker rounded-[28px] bg-lilac text-ink p-7 sm:p-12 flex flex-col gap-5 items-center text-center">
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
