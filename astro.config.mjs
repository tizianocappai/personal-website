// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tizianocappai.com",
  output: "static",
  trailingSlash: "ignore",
  build: {
    // Inline the tiny stylesheet: one request per page, no render-blocking CSS file.
    inlineStylesheets: "always",
  },
});
