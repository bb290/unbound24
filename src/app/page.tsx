import { ChaosSpinner } from "@/components/ChaosSpinner";
import { HalfpipeSkater } from "@/components/HalfpipeSkater";
import { SiteFooter, SiteNav } from "@/components/site";
import { H2, Label, Section } from "@/components/ui";

// Unbound24 home (2026-11-13): a few fun things to play with. Services live on /local-loud.
// Rules: no "book a call" buttons ever (sites pre-qualify with an assessment instead); we don't say our
// slogans, we just do them; we, not I (except B's own words); no em dashes; no invented numbers.

const MARQUEE = ["A website that books jobs", "Show up every week", "Reviews on repeat", "Keep local businesses local", "Done for you"];

const FQB = [
  ["Found.", "People search for you and find you.", "bg-cyan", "-rotate-2"],
  ["Qualified.", "Quizzes, instant estimates and tools sort the right customers in.", "bg-teal", "rotate-1 lg:translate-x-8"],
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
            We help local businesses do the three that matter, really well. So the business you spent 10, 15, 20 years building stays strong, and stays local.
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

      {/* Skater */}
      <section id="dude" className="scroll-mt-20 border-t-2 border-border bg-surface-2">
        <div className="max-w-[960px] mx-auto px-4 py-16 sm:px-8 sm:py-24 flex flex-col items-center gap-6">
          <Label fill="bg-lilac">Click Dude</Label>
          <div className="w-full">
            <HalfpipeSkater />
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="flex flex-col gap-5">
            <Label>About</Label>
            <H2>Hi, this is B.</H2>
            <div className="flex flex-col gap-4 text-lg leading-relaxed max-w-[60ch]">
              <p>
                Brittany started as a social worker who answered a Craigslist ad for a free-rent site manager job. Over coffee, she talked the owner into letting her run all 55 of his units. She did plenty wrong, figured it out anyway, and earned a PhD from YouTube University along the way.
              </p>
              <p>
                That became Sagareus Property Management, now 800+ units, which she still owns. After years of quietly helping friends and family grow their service businesses, Unbound makes it official, with a handful of owner-operators we pick on purpose.
              </p>
              <p>
                Why? Local businesses are the backbone of the economy, and they&apos;re becoming an endangered species. A few simple moves, done consistently, make yours worth more and easier to hand down to someone in your own town.
              </p>
            </div>
            <blockquote className="sticker rounded-[20px] bg-surface p-6 max-w-[52ch] -rotate-1">
              <p className="font-display font-bold text-[24px] leading-snug">&ldquo;If it costs your peace, it&apos;s too expensive.&rdquo;</p>
              <footer className="mt-2 label text-muted">B</footer>
            </blockquote>
          </div>

          {/* Intro video placeholder: swap for the YouTube embed when it's recorded. */}
          <div className="sticker rounded-[28px] bg-surface-2 aspect-video w-full grid place-items-center lg:mt-14">
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <span className="grid place-items-center w-16 h-16 rounded-full bg-cyan border-2 border-border text-ink" aria-hidden="true">
                <svg viewBox="0 0 20 20" className="w-7 h-7 ml-1"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
              </span>
              <span className="label text-muted">Intro video coming soon</span>
            </div>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
