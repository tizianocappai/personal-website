import { build } from "astro";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

export default async function setup() {
  await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });
  await build({ root, logLevel: "warn" });
}
