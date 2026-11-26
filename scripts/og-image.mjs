// Generates public/og.png, the single Open Graph image shared by every page and language:
// 1200x630, name and role in a serif font on white, text only.
// Run with `npm run og-image` after changing the name or role, and commit the PNG.
import { Resvg } from "@resvg/resvg-js";
import { writeFile } from "node:fs/promises";

const name = "Tiziano Cappai";
const role = "Senior Frontend Developer";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <g font-family="Georgia, 'Times New Roman', serif" fill="#111111" text-anchor="middle">
    <text x="600" y="300" font-size="96">${name}</text>
    <text x="600" y="390" font-size="48" fill="#333333">${role}</text>
  </g>
</svg>`;

const png = new Resvg(svg, {
  font: { loadSystemFonts: true, defaultFontFamily: "Georgia" },
  fitTo: { mode: "original" },
}).render().asPng();

await writeFile(new URL("../public/og.png", import.meta.url), png);
console.log(`public/og.png written (${png.length} bytes)`);
