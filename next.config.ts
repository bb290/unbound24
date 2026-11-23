import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The course was taken off the site on 2026-11-23 (Brittany): the courses become a blog, starting fresh.
      // Until the blog exists, every old course address goes to the home page.
      { source: "/course", destination: "/", permanent: false },
      { source: "/course/:path*", destination: "/", permanent: false },
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
