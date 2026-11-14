import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/site";
import { Label } from "@/components/ui";
import { ResourceSections } from "@/components/ResourceSections";
import { RESOURCE_SECTIONS } from "@/content/resources";

// Placeholder items stay off the live page, and so does a section with nothing real in it yet.
const LIVE_SECTIONS = RESOURCE_SECTIONS.map((s) => ({ ...s, items: s.items.filter((i) => !i.placeholder) })).filter((s) => s.items.length > 0);

// Resources (2026-11-14): books, podcasts, videos and services B likes. Items live in src/content/resources.ts.

export const metadata: Metadata = {
  title: "Resources | Unbound24",
  description: "Books, podcasts, YouTube videos and services we like for running a local service business.",
  openGraph: { url: "/resources", images: [{ url: "/og/resources.png", width: 1200, height: 630, alt: "Resources" }] },
};

export default function Resources() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav active="/resources" />

      <header className="max-w-[1200px] mx-auto px-4 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-12 flex flex-col gap-6">
        <Label fill="bg-cyan">Resources</Label>
        <h1 className="font-display font-extrabold text-[44px] leading-[0.95] tracking-[-0.02em] sm:text-[72px] max-w-[16ch]">
          Stuff we <span className="torn bg-cyan">like.</span>
        </h1>
        <p className="text-[20px] leading-relaxed max-w-[58ch]">Books, podcasts, videos and services worth your time.</p>
        <p className="-mt-3 text-sm text-muted max-w-[70ch]">
          Some of these are affiliate links. If you buy through one, we may earn a small commission at no cost to you. As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 pb-16 sm:px-8 sm:pb-24">
        <ResourceSections sections={LIVE_SECTIONS} />
      </main>

      <SiteFooter />
    </div>
  );
}
