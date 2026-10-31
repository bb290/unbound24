import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 0.2 The Framework became Business Breakdown (2026-10-31); its intro moved to /course.
      { source: "/course/the-framework", destination: "/course/business-breakdown", permanent: true },
    ];
  },
};

export default nextConfig;
