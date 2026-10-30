import type { MetadataRoute } from "next";
import { READY_LESSONS } from "@/content/course";

const BASE = "https://www.unbound24.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/course`, changeFrequency: "weekly", priority: 0.9 },
    ...READY_LESSONS.map((lesson) => ({
      url: `${BASE}/course/${lesson.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
