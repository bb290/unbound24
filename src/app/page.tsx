import { ChaosSpinner } from "@/components/ChaosSpinner";
import { FocusOrBreak } from "@/components/FocusOrBreak";
import { SiteFooter, SiteNav } from "@/components/site";
import { VendingMachine } from "@/components/VendingMachine";
import { H2, Label, Section } from "@/components/ui";

// Unbound24 home (2026-11-13): a few fun things to play with. Services live on /local-loud.
// Rules: no "book a call" buttons ever (sites pre-qualify with an assessment instead); we don't say our
// slogans, we just do them; we, not I (except B's own words); no em dashes; no invented numbers.

const MARQUEE = ["A website that books jobs", "Show up every week", "Reviews on repeat", "Keep local businesses local", "Done for you"];

const FQB = [
  ["Found.", "People search for you and find you.", "bg-cyan", "-rotate-2"],
  ["Qualified.", "Quizzes, instant estimates and tools sort the right customers in.", "bg-teal", "rotate-1 xl:translate-x-8"],
  ["Booked.", "They read your reviews and book online.", "bg-lilac", "-rotate-1"],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/" />

      {/* Hero */}
      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-16 sm:px-8 sm:pt-20 sm:pb-24 grid gap-14 items-center lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-6 min-w-0">
          <Label>Marketing for local service businesses</Label>
          <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[15ch]">
            Doing 10 things at 50% is still <span className="torn bg-teal">an F.</span>
          </h1>
          <p className="text-[20px] leading-relaxed max-w-[52ch]">
            We help local businesses find the people they can help.
          </p>
        </div>

        <div className="relative flex flex-col gap-5 max-w-[420px] w-full mx-auto lg:mx-0 lg:justify-self-end">
          {FQB.map(([t, b, f, r]) => (
            <div key={t} className={`sticker rounded-[20px] ${f} ${r} text-ink p-6`}>
              <p className="font-display font-extrabold text-[30px] leading-none">{t}</p>
              <p className="mt-2 text-[16px] font-medium">{b}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Marquee */}
      <div className="overflow-hidden border-y-2 border-border bg-cyan text-ink py-3.5" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {MARQUEE.map((m) => (
                <span key={m + k} className="flex items-center font-display font-extrabold text-[20px] whitespace-nowrap px-6">
                  {m}<span className="ml-12 inline-block w-2.5 h-2.5 rounded-full bg-ink" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Chaos spinner */}
      <section id="spin" className="scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-4 py-16 sm:px-8 sm:py-24">
          <ChaosSpinner ctaHref="/local-loud" />
        </div>
      </section>

      {/* Intro video: its own section (Brittany, 2026-11-14). Placeholder: swap for the YouTube embed when it's recorded. */}
      <Section id="video">
        <div className="sticker rounded-[28px] bg-surface-2 aspect-video w-full max-w-[960px] mx-auto grid place-items-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <span className="grid place-items-center w-16 h-16 rounded-full bg-cyan border-2 border-border text-ink" aria-hidden="true">
              <svg viewBox="0 0 20 20" className="w-7 h-7 ml-1"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
            </span>
            <span className="label text-muted">Intro video coming soon</span>
          </div>
        </div>
      </Section>

      {/* Get sh*t done / Take a break: two card buttons that open the Beast Mode Timer and the skater in pop-ups (Brittany, 2026-11-14) */}
      <section id="dude" className="scroll-mt-20 border-t-2 border-border bg-surface-2">
        <div className="max-w-[1200px] mx-auto px-4 py-16 sm:px-8 sm:py-24">
          <FocusOrBreak />
        </div>
      </section>

      {/* Left: the primary CTA, the free brand guide (placeholder until the widget is built). Right: the Value Vending Machine. */}
      <Section id="brand-guide">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_minmax(0,440px)] items-start">
          <div className="flex flex-col gap-6 min-w-0">
            {/* PLACEHOLDER (2026-11-14): the Brand Guide widget goes here. 7 questions, no email, instant download with 3-5 prompts. */}
            <div className="sticker rounded-[28px] bg-cyan text-ink p-7 sm:p-10 flex flex-col gap-5">
              <span className="label inline-block self-start rounded-full bg-surface text-foreground px-3 py-[7px]">Free brand guide</span>
              <h2 className="font-display font-extrabold text-[36px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">Your brand guide in 7 questions.</h2>
              <p className="text-[19px] leading-relaxed max-w-[44ch]">No email needed. Answer 7 questions and download your brand guide on the spot.</p>
              <span className="btn btn-secondary self-start opacity-80 cursor-default" aria-disabled="true">Coming soon</span>
            </div>

            <blockquote className="sticker rounded-[20px] bg-surface p-6 max-w-[52ch] -rotate-1">
              <p className="font-display font-bold text-[24px] leading-snug">&ldquo;Local businesses are the backbone of the economy, and they&apos;re becoming an endangered species.&rdquo;</p>
            </blockquote>
          </div>

          <div id="vend" className="scroll-mt-20 lg:sticky lg:top-24">
            <VendingMachine />
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
