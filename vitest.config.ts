import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    // Builds the site once; every test file asserts on the generated output in dist/.
    globalSetup: ["tests/build.global-setup.ts"],
  },
});
