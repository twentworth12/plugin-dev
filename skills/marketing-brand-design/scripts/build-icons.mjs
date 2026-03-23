#!/usr/bin/env node
/**
 * Extracts individual icons from the raw Figma export (assets/icons.svg).
 *
 * Usage:
 *   node scripts/build-icons.mjs                          # extract all → assets/icons/*.svg
 *   node scripts/build-icons.mjs bolt on-call ai-sre      # extract specific icons
 *   node scripts/build-icons.mjs --png bolt on-call                 # PNG in charcoal (default)
 *   node scripts/build-icons.mjs --png --color F25533 bolt on-call  # PNG in alarmalade
 *   node scripts/build-icons.mjs --png --color FFFFFF bolt          # PNG in white (dark backgrounds)
 *   node scripts/build-icons.mjs --png --size 120 bolt              # PNG at custom size
 *
 * Each output SVG is self-contained — correct viewBox, defs inlined, currentColor fills.
 * Gradient icons include their linearGradient/clipPath defs so they render standalone.
 *
 * Run this after updating icons.svg from Figma:
 *   1. Open the Figma Icon Library
 *   2. Select the "Original icons" frame
 *   3. Export as SVG → save to assets/icons.svg
 *   4. Run: node scripts/build-icons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SVGPathData } from "svg-pathdata";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, "..", "assets");
const INPUT = join(ASSETS, "icons.svg");
const ICONS_DIR = join(ASSETS, "icons");

// Parse flags
const args = process.argv.slice(2);
const pngMode = args.includes("--png");
const sizeIdx = args.indexOf("--size");
const pngSize = sizeIdx !== -1 ? parseInt(args[sizeIdx + 1], 10) : 80;
const colorIdx = args.indexOf("--color");
const pngColor = colorIdx !== -1 ? args[colorIdx + 1].replace(/^#/, "") : null;
const filterNames = args.filter((a, i) =>
  !["--png", "--size", "--color"].includes(a) &&
  (sizeIdx === -1 || i !== sizeIdx + 1) &&
  (colorIdx === -1 || i !== colorIdx + 1)
);

const GRID = 60;
const ICON_SIZE = 20;
const CHARCOAL = "#161618";
const FILL_RE = new RegExp(`fill="${CHARCOAL}(ff)?"`, "gi");
const STROKE_RE = new RegExp(`stroke="${CHARCOAL}(ff)?"`, "gi");

const svg = readFileSync(INPUT, "utf-8");

// 1. Extract <defs> block — build a map of ID → full element for per-icon inlining
const defsMatch = svg.match(/<defs>([\s\S]*?)<\/defs>/);
const defsInner = defsMatch ? defsMatch[1] : "";

const defById = new Map();
const defRe = /<(linearGradient|radialGradient|clipPath)[^>]*id="([^"]+)"[^>]*>[\s\S]*?<\/\1>/g;
let dm;
while ((dm = defRe.exec(defsInner)) !== null) {
  defById.set(dm[2], dm[0]);
}

// 2. Find the <g id="Original icons"> wrapper
const wrapperMatch = svg.match(/<g\s+id="Original icons">/);
if (!wrapperMatch) {
  console.error('Could not find <g id="Original icons"> in icons.svg');
  process.exit(1);
}

// 3. Extract each top-level icon <g>
const afterWrapper = svg.slice(wrapperMatch.index + wrapperMatch[0].length);
const icons = [];
let depth = 0;
let currentStart = -1;
let currentId = null;
const tagRe = /<(\/?)g(\s[^>]*)?\/?>/g;
let m;

while ((m = tagRe.exec(afterWrapper)) !== null) {
  const isClose = m[1] === "/";
  const isSelfClose = m[0].endsWith("/>");

  if (isClose) {
    depth--;
    if (depth < 0) break;
    if (depth === 0 && currentId) {
      icons.push({ id: currentId, content: afterWrapper.slice(currentStart, m.index) });
      currentId = null;
    }
  } else if (depth === 0) {
    const idMatch = m[0].match(/id="([^"]+)"/);
    if (idMatch) {
      currentId = idMatch[1];
      currentStart = m.index + m[0].length;
    }
    if (!isSelfClose) depth++;
  } else if (!isSelfClose) {
    depth++;
  }
}

// 4. Compute viewBox for each icon using svg-pathdata
function computeViewBox(content) {
  let minX = Infinity;
  let minY = Infinity;

  const pathRe = /\bd="([^"]+)"/g;
  let pm;
  while ((pm = pathRe.exec(content)) !== null) {
    for (const cmd of new SVGPathData(pm[1]).toAbs().commands) {
      if ("x" in cmd && cmd.x < minX) minX = cmd.x;
      if ("y" in cmd && cmd.y < minY) minY = cmd.y;
    }
  }

  const rectRe = /<rect\b[^>]*?\/?>/g;
  let rm;
  while ((rm = rectRe.exec(content)) !== null) {
    const xMatch = rm[0].match(/\bx="([\d.]+)"/);
    const yMatch = rm[0].match(/\by="([\d.]+)"/);
    if (xMatch) { const x = parseFloat(xMatch[1]); if (x < minX) minX = x; }
    if (yMatch) { const y = parseFloat(yMatch[1]); if (y < minY) minY = y; }
  }

  const circleRe = /<circle[^>]*?\bcx="([\d.]+)"[^>]*?\bcy="([\d.]+)"[^>]*?\br="([\d.]+)"/g;
  let cm;
  while ((cm = circleRe.exec(content)) !== null) {
    const cx = parseFloat(cm[1]), cy = parseFloat(cm[2]), r = parseFloat(cm[3]);
    if (cx - r < minX) minX = cx - r;
    if (cy - r < minY) minY = cy - r;
  }

  if (!Number.isFinite(minX)) return null;
  return `${Math.floor(minX / GRID) * GRID} ${Math.floor(minY / GRID) * GRID} ${ICON_SIZE} ${ICON_SIZE}`;
}

function sanitizeId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// 5. Process and write individual files
mkdirSync(ICONS_DIR, { recursive: true });

const processed = [];

for (const { id, content } of icons) {
  const viewBox = computeViewBox(content);
  if (!viewBox) continue;
  const sanitized = sanitizeId(id);
  if (filterNames.length > 0 && !filterNames.includes(sanitized)) continue;
  // Collect any gradient/clip-path defs this icon references
  const refs = [...content.matchAll(/url\(#([^)]+)\)/g)].map(m => m[1]);
  const iconDefs = [...new Set(refs)].map(r => defById.get(r)).filter(Boolean);
  const defsBlock = iconDefs.length ? `<defs>${iconDefs.join("")}</defs>` : "";

  processed.push({ sanitized, viewBox, content, defsBlock });
}

if (pngMode) {
  const sharp = (await import("sharp")).default;
  const fillColor = pngColor ? `#${pngColor}` : CHARCOAL;
  await Promise.all(processed.map(({ sanitized, viewBox, content, defsBlock }) => {
    const colored = content.replace(FILL_RE, `fill="${fillColor}"`).replace(STROKE_RE, `stroke="${fillColor}"`);
    // Stroke-only icons have no fill attribute — add fill="none" to prevent default black fill
    const hasStroke = STROKE_RE.test(content); STROKE_RE.lastIndex = 0;
    const hasFill = FILL_RE.test(content); FILL_RE.lastIndex = 0;
    const fillAttr = (hasStroke && !hasFill) ? ' fill="none"' : '';
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${pngSize}" height="${pngSize}"${fillAttr}>${defsBlock}${colored}</svg>`;
    return sharp(Buffer.from(svgStr)).png().toFile(join(ICONS_DIR, `${sanitized}.png`));
  }));
  console.log(`Rendered ${processed.length} icons → assets/icons/ (${pngSize}x${pngSize} PNG)`);
} else {
  for (const { sanitized, viewBox, content, defsBlock } of processed) {
    const recolored = content.replace(FILL_RE, 'fill="currentColor"').replace(STROKE_RE, 'stroke="currentColor"');
    const hasStroke = STROKE_RE.test(content); STROKE_RE.lastIndex = 0;
    const hasFill = FILL_RE.test(content); FILL_RE.lastIndex = 0;
    const fillAttr = (hasStroke && !hasFill) ? ' fill="none"' : '';
    const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${ICON_SIZE}" height="${ICON_SIZE}"${fillAttr}>\n${defsBlock}${recolored}\n</svg>\n`;
    writeFileSync(join(ICONS_DIR, `${sanitized}.svg`), out);
  }
  console.log(`Extracted ${processed.length} icons → assets/icons/`);
}
