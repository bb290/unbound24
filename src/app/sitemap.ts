import type { MetadataRoute } from "next";

const BASE = "https://www.unbound24.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/local-loud`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/websites`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/resources`, changeFrequency: "weekly", priority: 0.7 },
  ];
}
