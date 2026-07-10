import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://github.com/richar12138/ai-monitor-pro/sitemap.xml",
    host: "https://github.com/richar12138/ai-monitor-pro",
  };
}
