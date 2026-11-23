import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/site";
import { SITES_BUILT } from "@/content/sites-built";

// Projects (Brittany, 2026-11-23): a menu tab that shows her projects. Same sites and details as the
// "Sites I've Built" pop-up on /websites (src/content/sites-built.ts), as a page of its own.

export const metadata: Metadata = {
  title: "Projects | Unbound24",
  description: "Websites we've built for local service businesses: roofing, property management, software, sleep consulting, counselling and real estate photography.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", images: [{ url: "/og/projects.png?v=2", width: 1200, height: 630, alt: "Projects" }] },
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/projects" />

      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-12 flex flex-col gap-6">
        {/* Heading "Current & Past Projects" (Brittany, 2026-11-23; was "Sites I've built."). */}
        <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[16ch]">
          Current &amp; Past <span className="torn bg-lilac">Projects</span>
        </h1>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 pb-16 sm:px-8 sm:pb-24">
        <ul className="grid gap-8 md:grid-cols-2">
          {SITES_BUILT.map((s) => (
            <li key={s.slug} className="sticker flex flex-col rounded-[24px] overflow-hidden bg-surface">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="block border-b-2 border-border bg-surface-2" aria-label={`Open ${s.name} (new tab)`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/sites/${s.slug}.jpg`} alt={`${s.name} homepage`} width={1280} height={530} loading="lazy" className="w-full h-auto block" />
              </a>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h2 className="font-display font-extrabold text-[26px] leading-tight">{s.name}</h2>
                <dl className="grid gap-2 text-[16px] leading-snug">
                  <div><dt className="inline font-bold">Service: </dt><dd className="inline">{s.service}</dd></div>
                  <div><dt className="inline font-bold">Vibe: </dt><dd className="inline">{s.vibe}</dd></div>
                  <div>
                    <dt className="font-bold">Components:</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                      {s.components.map((c) => <span key={c} className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[13px] font-bold">{c}</span>)}
                    </dd>
                  </div>
                </dl>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-2 self-start font-bold underline underline-offset-4 hover:decoration-cyan">
                  Visit {s.url.replace(/^https:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
