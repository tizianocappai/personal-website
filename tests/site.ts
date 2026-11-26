// Helpers to read the built site (dist/) as a visitor or search engine receives it.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, type HTMLElement } from "node-html-parser";

export const distDir = fileURLToPath(new URL("../dist", import.meta.url));

export interface Page {
  /** URL path, e.g. "/" or "/it/career/" */
  route: string;
  file: string;
  html: string;
  bytes: number;
  doc: HTMLElement;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function toRoute(file: string): string {
  const rel = relative(distDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

/** Every file in dist/, as URL paths relative to the site root (e.g. "/favicon.svg"). */
export function allFiles(): string[] {
  return walk(distDir).map((f) => `/${relative(distDir, f).split(sep).join("/")}`);
}

export function allPages(): Page[] {
  return walk(distDir)
    .filter((f) => f.endsWith(".html"))
    .map((file) => {
      const html = readFileSync(file, "utf8");
      return { route: toRoute(file), file, html, bytes: Buffer.byteLength(html), doc: parse(html) };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}

export function page(route: string): Page {
  const found = allPages().find((p) => p.route === route);
  if (!found) throw new Error(`No built page for route ${route}`);
  return found;
}
