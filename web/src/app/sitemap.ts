import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { getProfessors } from "@/services/professors/Professorsapi";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/professors`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/faculties`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const response = await getProfessors();
  const professors = response.success && response.data ? response.data : [];

  return [
    ...staticPages,
    ...professors.map((professor) => ({
      url: `${SITE_URL}/professors/${encodeURIComponent(professor.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
