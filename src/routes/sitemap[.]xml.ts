import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

const paths = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/assistant", priority: "0.9", changefreq: "weekly" as const },
  { path: "/tutor", priority: "0.9", changefreq: "weekly" as const },
  { path: "/translate", priority: "0.9", changefreq: "weekly" as const },
  { path: "/stories", priority: "0.8", changefreq: "weekly" as const },
  { path: "/places", priority: "0.8", changefreq: "monthly" as const },
  { path: "/festivals", priority: "0.8", changefreq: "monthly" as const },
  { path: "/businesses", priority: "0.7", changefreq: "monthly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = paths
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              `  </url>`,
            ].join("\n"),
          )
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
