import type { MetadataRoute } from "next";

// /sitemap.xml: the public pages we want search engines and AI crawlers to find.
const BASE = "https://getgoodthinking.com";

const FUTURES_TRENDS = [
  "alphas-zs",
  "culture",
  "drugs-and-booze",
  "f-b",
  "fun",
  "retail",
  "silvers",
  "sport",
  "tech",
  "travel",
  "wellness-beauty",
  "who-made-this",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/speaking`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/speaking/press-kit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/jobs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/post`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/futures`, changeFrequency: "yearly", priority: 0.7 },
    ...FUTURES_TRENDS.map((slug) => ({
      url: `${BASE}/futures/trends/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
