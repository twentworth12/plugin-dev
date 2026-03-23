#!/usr/bin/env node
/**
 * Renders an HTML file to a PNG image using headless Chromium via Playwright.
 * The HTML should set its own width/height via CSS — the script captures at that size.
 *
 * Usage:
 *   node scripts/html-to-image.mjs input.html                  # → input.png
 *   node scripts/html-to-image.mjs input.html output.png       # → specific path
 *   node scripts/html-to-image.mjs input.html --scale 2        # → 2x resolution (retina)
 */

import { chromium } from "playwright";
import { resolve, basename, dirname, join } from "node:path";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/html-to-image.mjs <input.html> [output.png] [--scale N]");
  process.exit(1);
}

const input = resolve(args[0]);
if (!existsSync(input)) {
  console.error(`File not found: ${input}`);
  process.exit(1);
}

const scaleIdx = args.indexOf("--scale");
const scale = scaleIdx !== -1 ? parseFloat(args[scaleIdx + 1]) : 2;

let output;
if (args[1] && args[1] !== "--scale") {
  output = resolve(args[1]);
} else {
  output = join(dirname(input), basename(input, ".html") + ".png");
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: scale });

await page.goto(`file://${input}`, { waitUntil: "networkidle" });
await page.waitForFunction(() => document.fonts.ready);

// Size the viewport to the content
const size = await page.evaluate(() => {
  const el = document.querySelector("[data-capture]") || document.body;
  return { width: el.offsetWidth, height: el.offsetHeight };
});
await page.setViewportSize(size);

await page.screenshot({ path: output, fullPage: true });
await browser.close();
console.log(`Saved → ${output} (${size.width}x${size.height} @${scale}x)`);
