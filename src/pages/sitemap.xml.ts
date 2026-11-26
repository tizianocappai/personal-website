// /sitemap.xml: every route key in every language, each with its hreflang alternates.
// Built from src/i18n/routes.ts, so a new page is listed as soon as its route key exists.
// The not-found page has no route key and is left out.
import type { APIRoute } from "astro";
import { absoluteUrl, alternates, localizedPath, routes, type RouteKey } from "../i18n/routes";
import { languages } from "../i18n/ui";

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => absoluteUrl(path, site);
  const entries = (Object.keys(routes) as RouteKey[]).flatMap((route) =>
    languages.map((lang) => {
      const links = alternates(route)
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${url(a.path)}"/>`)
        .join("");
      return `<url><loc>${url(localizedPath(lang, route))}</loc>${links}</url>`;
    }),
  );
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${entries.join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
