import type { MetadataRoute } from "next";

import { SITE_URL } from "./lib/site";

const ROUTES = [
  "",
  "/about",
  "/programs",
  "/students",
  "/mentors",
  "/board",
  "/sponsors",
  "/events",
  "/projects",
  "/donate",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
