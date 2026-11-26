// Every page of the site, by route key. A page exists in every language at the same path,
// prefixed with /<lang> except for the default language (English, at the root).
// Adding a page: add its key here, create src/pages/<path>.astro and src/pages/it/<path>.astro,
// and render <Base route="<key>" ...>. Canonical, hreflang and the language switch follow.
import { defaultLang, type Lang } from "./ui";

export const routes = {
  home: "/",
  career: "/career/",
} as const satisfies Record<string, `/${string}`>;

export type RouteKey = keyof typeof routes;

/** Site-relative path of a page in a language, e.g. ("it", "home") -> "/it/". */
export function localizedPath(lang: Lang, route: RouteKey): string {
  const path = routes[route];
  return lang === defaultLang ? path : `/${lang}${path}`;
}
