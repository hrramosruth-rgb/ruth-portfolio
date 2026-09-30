import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/content";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
