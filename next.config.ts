import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 0.2 The Framework became Business Breakdown (2026-10-31); its intro moved to /course.
      { source: "/course/the-framework", destination: "/course/business-breakdown", permanent: true },
      // Stuck? was cut and Claude Projects merged into AI Essentials (2026-10-31).
      { source: "/course/check-your-foundation", destination: "/course", permanent: true },
      { source: "/course/claude-projects", destination: "/course/job-site-prep", permanent: true },
      // The library now matches Notion (2026-11-02): Course 1 is Hands-On AI as a Power Tool, Own Your 24 is its
      // lesson 1.2 (and takes over /course/own-your-24), and Connectors folds into Construct the Scaffolding.
      { source: "/course/put-ai-to-work", destination: "/course/hands-on-ai", permanent: true },
      { source: "/course/connectors", destination: "/course/hands-on-ai", permanent: true },
      // Renamed 2026-11-03: AI Essentials is now Job Site Prep, Construct the Scaffolding is now Lay the Foundation.
      { source: "/course/ai-set-up", destination: "/course/job-site-prep", permanent: true },
      { source: "/course/construct-the-scaffolding", destination: "/course/lay-the-foundation", permanent: true },
      // Old static Local + Loud page (2026-11-10, old prices) replaced by the app route /local-loud on 2026-11-13.
      { source: "/local-loud.html", destination: "/local-loud", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Kewl landing page (2026-11-03): a standalone page, not in the nav or sitemap.
      { source: "/kewl", destination: "/kewl.html" },
    ];
  },
};

export default nextConfig;
