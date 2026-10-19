import type { MetadataRoute } from "next";

// /robots.txt: everyone (including AI crawlers) may read the public site;
// admin tools, API endpoints, the phone fix page, design drafts, and the PDF
// print layout stay out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/fix", "/add", "/speaking/press-kit/pdf", "/v1", "/v2", "/v3", "/v4", "/v5"],
    },
    sitemap: "https://getgoodthinking.com/sitemap.xml",
  };
}
