// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tizianocappai-website.vercel.app",
  output: "static",
  trailingSlash: "ignore",
  // English at the root, Italian under /it/. No Accept-Language redirect: the URL you open is the page you get.
  i18n: {
    locales: ["en", "it"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  build: {
    // Inline the tiny stylesheet: one request per page, no render-blocking CSS file.
    inlineStylesheets: "always",
  },
});
