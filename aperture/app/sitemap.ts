import type { MetadataRoute } from "next";

const BASE = "https://aperturescience.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/ai", "/ai/search", "/access", "/waf", "/login", "/ssl", "/rl", "/lb", "/apply"];
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
  }));
}
