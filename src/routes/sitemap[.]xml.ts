import { createFileRoute } from "@tanstack/react-router";
import { PUBLIC_ROUTES, SITE } from "@/lib/site";

/**
 * Sitemap for the public marketing pages only. Workspace routes are private and
 * deliberately excluded (they also send noindex).
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = pickOrigin(request.url);
        const today = new Date().toISOString().slice(0, 10);
        const urls = PUBLIC_ROUTES.map(
          (path) => `  <url>
    <loc>${origin}${path === "/" ? "/" : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${path === "/" ? "1.0" : "0.5"}</priority>
  </url>`,
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

/** Prefer the configured domain; fall back to the request origin. */
function pickOrigin(requestUrl: string): string {
  if (SITE.baseUrl && !SITE.baseUrl.includes("flowinput.app")) return SITE.baseUrl;
  try {
    return new URL(requestUrl).origin;
  } catch {
    return SITE.baseUrl;
  }
}
