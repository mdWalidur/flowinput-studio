/**
 * Single place to configure the public identity of the site.
 * Set VITE_SITE_URL to your real domain before launch; canonical URLs, the
 * sitemap and structured data all read from here.
 */
const FALLBACK_URL = "https://flowpoint.app";

export const SITE = {
  name: "FlowPoint",
  tagline: "Where the flow begins.",
  description:
    "FlowPoint is a content preparation workspace that turns source material into clean Markdown, study packs, AI context, product plans and clearer prompts.",
  baseUrl:
    (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(/\/$/, "") || FALLBACK_URL,
} as const;

export const canonical = (path = "/"): string =>
  `${SITE.baseUrl}${path === "/" ? "/" : path.replace(/\/$/, "")}`;

/** Routes that belong to the public marketing site and should be indexed. */
export const PUBLIC_ROUTES = ["/", "/terms", "/privacy", "/contact"] as const;

/** Head meta for a private, app-only route: keep it out of search results. */
export const privateRouteMeta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
  ],
  links: [] as Array<Record<string, string>>,
});

/** Head meta for a public marketing page. */
export const publicRouteMeta = (args: { path: string; title: string; description: string }) => ({
  meta: [
    { title: args.title },
    { name: "description", content: args.description },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: args.title },
    { property: "og:description", content: args.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical(args.path) },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: args.title },
    { name: "twitter:description", content: args.description },
  ],
  links: [{ rel: "canonical", href: canonical(args.path) }],
});

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: canonical("/"),
  description: SITE.description,
});

export const webApplicationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  url: canonical("/"),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any modern web browser",
  description: SITE.description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Convert documents and notes to clean Markdown",
    "Build a study pack from source material",
    "Prepare a structured brief for an AI assistant",
    "Draft a website or app plan from rough notes",
    "Rewrite a rough request into a clearer prompt",
  ],
});
