import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/app/", "/login", "/signup", "/reset", "/invite"],
      disallow: ["/api", "/api/"],
    },
    sitemap: "https://nefira.xyz/sitemap.xml",
  };
}
