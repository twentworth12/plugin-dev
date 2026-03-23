---
name: Marketing Brand Designer
description: incident.io's design system — the complete visual identity for any design output. Use this skill whenever producing visual work that should look like incident.io, including web pages, dashboards, tools, landing pages, presentations, documentation, social assets, or any branded visual output. Provides colors, typography (custom fonts), product icons, logo assets, semantic color tokens, Tailwind implementation, and component patterns. Triggers on any request to build, create, design, or style something visually.
compatibility: Requires Node.js 18+ for icon extraction (scripts/build-icons.mjs) and PDF generation (scripts/html-to-pdf.mjs, uses Playwright). Run `npm install` in the skill directory for dependencies. Tailwind setup uses the Play CDN (requires internet). Fonts loaded from https://incident.io/fonts/. TTF font files in assets/fonts/ for PDF/non-web embedding.
metadata:
  author: incident.io
  version: 1.0.0
---

# incident.io Design System

The implementation source of truth for incident.io's visual identity. For the full abstract design spec (principles, rules, AI image prompting, video typography, logo rules), read `references/design-principles.md`. This skill turns that spec into working code: Tailwind setup, icon pipeline, patterns, and tested tokens cross-referenced against the live website's `tailwind.config.js`.

---

## Brand fundamentals

### Colors

The neutrals set the tone. Alarmalade makes the point.

| Token      | Hex     | When to use                                          |
| ---------- | ------- | ---------------------------------------------------- |
| Sand       | #F8F5F0 | Page backgrounds (marketing default)                 |
| Light Sand | #F1EBE2 | Secondary surfaces, subtle depth                     |
| Dark Sand  | #E4D9C8 | Borders, dividers                                    |
| White      | #FFFFFF | Cards, inputs, containers                            |
| Charcoal   | #161618 | Raw color — prefer semantic tokens below             |
| Alarmalade | #F25533 | Primary accent — CTAs, links, interactive highlights |
| Burgundy   | #5A0A17 | Secondary accent — dark emphasis                     |

**Semantic content colors** (use these for text — they have the correct opacity baked in):

- `content-primary` — headings, 100% (#161618)
- `content-secondary` — body text, 66% (#161618a8)
- `content-tertiary` — metadata/captions, 40% (#16161866)

**Semantic surface colors:**

- `surface-primary` — white (#FFFFFF)
- `surface-secondary` — sand light (#F8F5F0)
- `surface-tertiary` — sand (#F1EBE2)
- `surface-quaternary` — sand dark (#E4D9C8)

**Rules:**

- Sand is the default page background. White is for cards and product surfaces.
- Never use black — Charcoal is the darkest surface.
- Alarmalade is purposeful. Use it for CTAs, alerts, and energy moments. If everything is orange, nothing is.

### Typography

Serif for display headings (h1–h3). Sans for everything else. Always sentence case — never title case or all caps.

**Weights matter.** Headings (h1–h3) are weight 400 (Book), not bold. Only h4 and emphasis variants use weight 500 (Medium).

**Text wrapping.** Apply `text-wrap: balance` to all headings so line breaks distribute evenly.

| Style            | Font  | Weight | Size | Line Height | Letter Spacing |
| ---------------- | ----- | ------ | ---- | ----------- | -------------- |
| h1               | Serif | 400    | 80px | 1.0         | -3.2px         |
| h1-60            | Serif | 400    | 60px | 1.1         | -1.8px         |
| h2               | Serif | 400    | 44px | 1.1         | -1.32px        |
| h3               | Serif | 400    | 36px | 1.15        | -0.9px         |
| h4               | Sans  | 500    | 24px | 1.3         | -0.24px        |
| body-lg          | Sans  | 400    | 24px | 1.3         | -0.24px        |
| body-emphasis    | Sans  | 500    | 18px | 1.4         | -0.18px        |
| body             | Sans  | 400    | 18px | 1.4         | -0.18px        |
| body-sm          | Sans  | 400    | 16px | 1.4         | -0.16px        |
| body-sm-emphasis | Sans  | 500    | 16px | 1.4         | -0.16px        |
| body-xs          | Sans  | 400    | 13px | 1.4         | -0.13px        |
| body-xs-emphasis | Sans  | 500    | 13px | 1.4         | -0.13px        |

All letter spacing is negative (tight). Monospace (Geist Mono) for code and metrics. Handwritten (Kalam) for playful annotations — use sparingly.

**Font files** hosted at `https://incident.io/fonts/`:

- `stkbureau-serif-light.woff2` (300), `stkbureau-serif-book.woff2` (400), `stkbureau-serif-medium.woff2` (500), `stkbureau-serif-bold.woff2` (700)
- `stkbureau-sans-book.woff2` (400), `stkbureau-sans-medium.woff2` (500), `stkbureau-sans-bold.woff2` (700)
- `geist-mono-latin.woff2`, `kalam-regular.ttf`

### Spacing & layout

| Concern             | Value                     |
| ------------------- | ------------------------- |
| Page padding        | 32px mobile, 48px desktop |
| Section gap         | 24px                      |
| Element gap         | 12–16px                   |
| Card padding        | 20–24px                   |
| Card radius         | 12–16px                   |
| Input radius        | 8px                       |
| Button/badge radius | Full (pill-shaped)        |

Borders, not shadows. Use 1px solid Dark Sand for separation.

### Motion

| Element         | Animation                    | Timing                          |
| --------------- | ---------------------------- | ------------------------------- |
| Headlines       | Rise from baseline (40–60px) | 0.5–0.8s, exponential ease out  |
| Supporting text | Fade + slide (15–25px)       | 0.3–0.5s, cubic ease out        |
| UI elements     | Pop with spring physics      | Damping 8–12, stiffness 150–200 |
| CTAs / buttons  | Bounce with subtle overshoot | Spring, scale 0.9 → 1.0         |

Use CSS transitions (~200ms) for hover/focus. Reserve spring physics for entrances and layout changes. `-webkit-font-smoothing: antialiased` on body.

---

## Assets

### Logos

Logo files are in `assets/brand/` (SVG + PNG).

| File                        | Use on                           |
| --------------------------- | -------------------------------- |
| `icon-alarmalade.svg`       | Sand/white backgrounds (default) |
| `icon-dark.svg`             | Sand/white backgrounds           |
| `icon-light.svg`            | Dark/charcoal backgrounds ONLY   |
| `wordmark-colour-dark.svg`  | Sand/white backgrounds (default) |
| `wordmark-colour-light.svg` | Dark/charcoal backgrounds ONLY   |

Use the flame icon when the company name is already visible. Use the full wordmark when introducing the brand. Never use a flame emoji as a stand-in.

**Fetching company logos** (in priority order):

1. Try `https://www.google.com/s2/favicons?domain=example.com&sz=256` — always works, up to 256px
2. Fetch the company's homepage HTML and look for higher-res logos:
   - `<link rel="apple-touch-icon">` href (often 180px+)
   - `<img>` inside `<header>` or `<nav>` where src/alt/class contains "logo"
   - Inline `<svg>` inside elements with class/id containing "logo" in header/nav
3. If all results are below 128px, ask the user for a direct URL or local file
4. Always trim whitespace from logos before use — logos often have transparent padding that makes them appear small in cards and videos

### Icons

Product icons sourced from `assets/icons.svg` (Figma export).

**Extract icons** (if `assets/icons/` doesn't exist or icons.svg was updated):

```bash
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs                                    # all icons → assets/icons/*.svg
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs bolt on-call ai-sre                # specific icons only
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs --png bolt on-call                 # PNG in charcoal (default)
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs --png --color F25533 bolt on-call  # PNG in alarmalade
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs --png --color FFFFFF bolt          # PNG in white (for dark backgrounds)
node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/build-icons.mjs --png --size 120 bolt              # PNG at custom size
```

Each extracted SVG is self-contained — correct viewBox, gradient defs inlined, `currentColor` fills. To use an icon, read the file and inline its contents directly:

```html
<!-- Read assets/icons/on-call.svg and inline it -->
<svg class="w-5 h-5" viewBox="...">...</svg>
```

**Product icons:**

| Product      | Icon ID       |
| ------------ | ------------- |
| On-call      | `on-call`     |
| Response     | `bolt`        |
| AI SRE       | `ai-sre`      |
| Status Pages | `status-page` |
| Integrations | `integration` |
| Insights     | `chart`       |
| Catalog      | `book`        |
| Enterprise   | `star`        |
| AI (general) | `sparkles`    |
| Post-mortems | `file-ai`     |

**Common UI icons:** `arrow-left`, `add-circle`, `search`, `check`, `alert`, `clock`, `activity`, `calendar`, `archive`, `escalate`, `incident`, `automation`, `announcement`

**Sizing:** 16px inline, 20px buttons, 24px hero/empty states.

**Updating from Figma:**

1. Export "Original icons" frame as SVG → save to `assets/icons.svg`
2. Delete `assets/icons/` directory and re-run `node scripts/build-icons.mjs`

---

## Output formats

Reference templates are organized by output type:
- `references/web/` for HTML/Tailwind,
- `references/docx/` for document generation.

General design guidance lives at `references/design-principles.md`.

### Web pages (HTML)

Use the Tailwind 4 Play CDN with the brand preconfigured. Read `references/web/tailwind-head.html` and copy into your `<head>`. For component patterns, read `references/web/patterns.html`.

### PDF

Build as an HTML file using brand fonts (`@font-face` from incident.io/fonts), then run `node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/html-to-pdf.mjs input.html`. Uses headless Chromium via Playwright — fonts and letter-spacing are pixel-perfect. Use `@page { size: A4; margin: 0; }` with `body { padding: 20mm; }` for full-bleed Sand background. Add `break-inside: avoid` on cards/tables.

### Social images (PNG)

Build as an HTML file sized to 1200x630 (LinkedIn/Twitter) or 1200x1200 (square), then run `node ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design/scripts/html-to-image.mjs input.html`. Uses headless Chromium — same font/CSS fidelity as PDF. Add `data-capture` attribute to the element to capture. Default 2x scale for retina.

### Documents (DOCX → Google Docs)

Use the `docx` npm package. Read `references/docx/docx-template.mjs` — a parameterized template that generates a branded 4-page business case. Modify the `CONTENT` object and run it. Fonts: Merriweather Light (serif), Inter (sans), Roboto Mono (mono). A4, 25mm margins. Run from the skill directory with an output path: `cd ${CLAUDE_PLUGIN_ROOT}/skills/marketing-brand-design && node references/docx/docx-template.mjs /tmp/my-bizcase.docx`

The cover page always has a Sand background — use `assets/sand-page.png` as a behind-text floating image at `794×1123` points (full A4 bleed). DOCX doesn't support per-section background colors natively, so the image approach is required. See the `sandBg()` helper in the template.

### Presentations (PPTX → Google Slides)

Use PptxGenJS (Node). Fonts: Merriweather Light (serif, ~20% smaller than web sizes for Google Slides), Inter (sans). Icons: `node scripts/build-icons.mjs --png --color F25533 bolt on-call` then embed as base64. Sand backgrounds, Alarmalade accents, pill-shaped CTA buttons.

---

## Webapp archetypes

When building interactive web tools, use these as starting points:

- **Calculator / converter** — inputs above (white card), derived results below (sand card), real-time updates
- **Data dashboard** — stat cards in a grid, charts below, wider max-width
- **Interactive tool** — split layout (input left, output right), live updates on keystroke
- **Survey / form** — one step at a time, summary screen at end, localStorage
- **Timer / countdown** — large centered display, start/pause/reset buttons
- **Voting / ranking** — card grid, click to vote, live results

---

## Working files vs deliverables

When generating non-web outputs (DOCX, PDF, PPTX, video), keep build scripts and temporary files in `/tmp/` or a scratch workspace — not in `outputs/`. Only the final deliverable goes to `outputs/`. Clean up working files after the user is happy with the result.

---

## Do / Don't

**Do:**

- Use semantic color tokens (`text-content-secondary`) not raw opacity (`text-charcoal/60`)
- Use the typography scale — not arbitrary sizes
- Use sentence case everywhere
- Use borders for separation — not shadows
- Keep Alarmalade purposeful — CTAs, alerts, energy moments
- Give every interactive element a visible focus state
- Maintain generous whitespace
- Apply `-webkit-font-smoothing: antialiased`

**Don't:**

- Use black backgrounds (Charcoal is the darkest)
- Use default framework colors as primary palette
- Use title case or all caps
- Use heavy shadows or drop shadows on text
- Use Alarmalade for body text or large background areas
- Build first and brand later

---

## Examples

**Example 1: "Build me a features page"**

1. Read `references/web/tailwind-head.html` → copy into `<head>`
2. Run `node scripts/build-icons.mjs bolt on-call status-page ai-sre book chart`
3. Read each icon file from `assets/icons/` and inline its SVG contents
4. Read `references/web/patterns.html` → use card pattern with `text-body-emphasis` titles
5. Apply `bg-sand-light` background, `text-content-primary` headings, `text-content-secondary` body
   Result: On-brand feature page with custom fonts, product icons, and semantic colors

**Example 2: "Make a dashboard with metrics"**

1. Same setup (tailwind-head, extract needed icons, patterns)
2. Use the data dashboard archetype: stat cards in a grid at top, charts below
3. Stat values in `font-mono text-h3`, labels in `text-body-xs text-content-tertiary`
4. Trend indicators with emerald (up) / alarmalade (down) badge variants
   Result: Metrics dashboard matching the brand

**Example 3: "Generate a PDF report"**

1. Build the report as an HTML file using brand fonts (`@font-face` from incident.io/fonts), semantic color tokens, and exact letter-spacing values from the typography scale
2. Add print CSS: `@page { size: A4; margin: 0; }` with `body { padding: 20mm; }` for full-bleed background
3. Use `break-inside: avoid` on cards/tables and `break-after: avoid` on headings to prevent awkward page breaks
4. Run `node scripts/html-to-pdf.mjs report.html` → pixel-perfect PDF with embedded fonts
   Result: On-brand PDF with custom fonts and correct letter-spacing

**Example 4: "Create a PowerPoint presentation"**

1. Run `node scripts/build-icons.mjs --png --color F25533 bolt on-call ai-sre` for Alarmalade icons
2. Use PptxGenJS (Node) or python-pptx. Font fallbacks: Merriweather (serif), Helvetica Neue (sans)
3. Merriweather renders ~20% larger than STK Bureau Serif — reduce heading sizes accordingly (e.g., 32pt instead of 40pt) and give text boxes extra width/height to prevent overflow in Google Slides
4. Embed PNG icons from `assets/icons/` as base64 data
   Result: On-brand presentation compatible with Google Slides

**Example 5: "Create a branded document"**

1. Use the `docx` npm package to generate DOCX files compatible with Google Docs
2. Reference `references/docx/docx-template.mjs` for the branded business case template — modify the CONTENT object and run it to generate a DOCX
3. Font fallbacks for Google Docs: Merriweather Light (serif headings), Calibri (sans body), Roboto Mono (mono footer)
4. Brand elements: Sand cover page, Alarmalade divider rules and eyebrow text, flame icon in header/footer, 25mm margins
   Result: On-brand DOCX that imports cleanly into Google Docs

---

## Troubleshooting

**Icons don't render**

- Cause: Icon files not extracted yet, or SVG not inlined
- Solution: Run `node scripts/build-icons.mjs` to extract icons, then read each SVG file from `assets/icons/` and inline its contents directly in the HTML.

**Fonts look heavy / different from the website**

- Cause: Missing `-webkit-font-smoothing: antialiased` on body
- Solution: Ensure `references/web/tailwind-head.html` is copied exactly — it includes font smoothing in the body rule.

**Custom Tailwind utilities not working (text-h2, text-content-secondary, etc.)**

- Cause: Using the wrong CDN script tag or missing `type="text/tailwindcss"` on the style block
- Solution: Use `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>` and ensure the style block has `type="text/tailwindcss"`.

**`node scripts/build-icons.mjs` fails**

- Cause: `svg-pathdata` not installed
- Solution: Run `npm install` from the skill directory (it has a package.json with the dependency).

**Icons stale after Figma update**

- Cause: Old extracted files cached from previous icon set
- Solution: Delete `assets/icons/` directory and re-run `node scripts/build-icons.mjs`.
