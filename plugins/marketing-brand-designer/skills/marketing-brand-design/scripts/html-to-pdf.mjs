#!/usr/bin/env node
/**
 * Converts an HTML file to PDF using headless Chromium via Playwright.
 * Preserves custom fonts, letter-spacing, and all CSS — pixel-perfect output.
 *
 * Usage:
 *   node scripts/html-to-pdf.mjs input.html                  # → input.pdf (same directory)
 *   node scripts/html-to-pdf.mjs input.html output.pdf       # → specific output path
 *   node scripts/html-to-pdf.mjs input.html --format letter   # US Letter instead of A4
 *
 * The HTML file should include @font-face declarations and @page CSS for best results.
 * Fonts from https://incident.io/fonts/ are loaded automatically.
 */

import { chromium } from "playwright";
import { resolve, basename, dirname, join } from "node:path";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/html-to-pdf.mjs <input.html> [output.pdf] [--format a4|letter]");
  process.exit(1);
}

const input = resolve(args[0]);
if (!existsSync(input)) {
  console.error(`File not found: ${input}`);
  process.exit(1);
}

// Parse output path
let output;
const formatIdx = args.indexOf("--format");
const format = formatIdx !== -1 ? args[formatIdx + 1] : "A4";

if (args[1] && args[1] !== "--format") {
  output = resolve(args[1]);
} else {
  output = join(dirname(input), basename(input, ".html") + ".pdf");
}

const browser = await chromium.launch();
const page = await browser.newPage();

// Navigate to the HTML file
await page.goto(`file://${input}`, { waitUntil: "networkidle" });

// Wait for web fonts to load
await page.waitForFunction(() => document.fonts.ready);

// Generate PDF
await page.pdf({
  path: output,
  format,
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();
console.log(`Saved → ${output}`);
