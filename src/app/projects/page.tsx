import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/site";
import { ProjectCard } from "@/components/ProjectCard";
import { SITES_BUILT } from "@/content/sites-built";

// Projects (Brittany, 2026-11-23): a menu tab that shows her projects. Same sites and details as the
// "Sites I've Built" pop-up on /websites (src/content/sites-built.ts),
// each with 6 screens to click through and the details behind a "Project details" button (ProjectCard).

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
        {/* One project per row so the preview is big (Brittany, 2026-11-23). */}
        <ul className="flex flex-col gap-10 sm:gap-14 max-w-[1040px] mx-auto">
          {SITES_BUILT.map((s) => (
            <li key={s.slug}>
              <ProjectCard site={s} />
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
