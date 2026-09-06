import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        let origin = SITE.baseUrl;
        try {
          if (SITE.baseUrl.includes("flowinput.app")) origin = new URL(request.url).origin;
        } catch {
          /* keep configured base URL */
        }

        const body = `User-agent: *
Allow: /
Disallow: /workspace
Disallow: /my-work
Disallow: /settings

Sitemap: ${origin}/sitemap.xml
`;
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
