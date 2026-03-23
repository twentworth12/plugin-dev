# incident.io Design System

The single source of truth for visual design across all agents, skills, and content creation. Every agent or skill that produces visual output (images, videos, webapps, presentations, PDFs) should reference this file.

**Implementation:** The `brand-design` skill implements this spec in Tailwind CSS with tested patterns, icon scripts, and font setup. Use the skill for any coded output. This file defines the *what and why*; the skill handles the *how*.

---

## Color Palette

**The neutrals set the tone; Alarmalade makes the point.**

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **White** | `#FFFFFF` | 255, 255, 255 | Clean foundation, card backgrounds |
| **Alarmalade** | `#F25533` | 242, 85, 51 | Primary accent, CTAs, energy moments |
| **Charcoal** | `#161618` | 22, 22, 24 | Headings, primary text, contrast |
| **Burgundy** | `#5A0A17` | 89, 9, 23 | Secondary accent, dark highlights |

### Sand Family (Surfaces)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Sand** | `#F8F5F0` | 248, 245, 240 | Page backgrounds, light surfaces |
| **Light Sand** | `#F1EBE2` | 241, 235, 226 | Secondary surfaces, subtle depth |
| **Dark Sand** | `#E4D9C8` | 228, 217, 200 | Borders, dividers, stronger contrast |

### Semantic Content Colors

Use these for text — they have the correct opacity baked in (sourced from the website's `tailwind.config.js`):

| Token | Value | Usage |
|-------|-------|-------|
| **content-primary** | `#161618` (100%) | Headings, labels |
| **content-secondary** | `#161618` at 66% | Body text, descriptions |
| **content-tertiary** | `#161618` at 40% | Metadata, captions, timestamps |

### Semantic Surface Colors

| Token | Value | Usage |
|-------|-------|-------|
| **surface-primary** | `#FFFFFF` | Cards, inputs, containers |
| **surface-secondary** | `#F8F5F0` | Page backgrounds (marketing) |
| **surface-tertiary** | `#F1EBE2` | Secondary surfaces |
| **surface-quaternary** | `#E4D9C8` | Borders, dividers |

### Rules

- **Never use black as a background.** Charcoal (#161618) is our darkest surface.
- **Alarmalade is purposeful.** Use it for CTAs, alerts, and energy moments. "If everything is orange, nothing is."
- **Sand is the default background** for marketing. White is the default for product.
- **Use semantic content tokens for text**, not raw Charcoal with opacity modifiers.

### Accessibility

| Combination | Compliance |
|-------------|------------|
| Charcoal on White | WCAG AAA |
| Charcoal on Sand | WCAG AAA |
| White on Charcoal | WCAG AAA |
| White on Alarmalade | WCAG AA |
| Alarmalade on White | WCAG AA (large text only) |

Minimum 4.5:1 contrast ratio for body text. Avoid Alarmalade for long text blocks.

---

## Typography

**Always use sentence case.** Never all caps or title case.

### Typefaces

| Typeface | Role | Usage |
|----------|------|-------|
| **STK Bureau Serif** (Book, 400) | Display headings | h1, h2, h3 — large, confident headlines |
| **STK Bureau Serif** (Light, 300) | Available for lighter display | Load alongside Book for optimal rendering |
| **STK Bureau Sans** (Book, 400) | Body text | Paragraphs, descriptions, UI text |
| **STK Bureau Sans** (Medium, 500) | Emphasis | h4, subheaders, emphasized body text |
| **Geist Mono** (Medium) | Technical | Code, metrics, technical callouts |
| **Kalam** (Regular) | Handwritten | Annotations, playful accents — use sparingly |

### Typography Scale

| Style | Font | Weight | Size | Line Height | Letter Spacing |
|-------|------|--------|------|-------------|----------------|
| **h1** | Serif | 400 | 80px | 1.0 | -3.2px |
| **h1-60** | Serif | 400 | 60px | 1.1 | -1.8px |
| **h2** | Serif | 400 | 44px | 1.1 | -1.32px |
| **h3** | Serif | 400 | 36px | 1.15 | -0.9px |
| **h4** | Sans | 500 | 24px | 1.3 | -0.24px |
| **body-lg** | Sans | 400 | 24px | 1.3 | -0.24px |
| **body-emphasis** | Sans | 500 | 18px | 1.4 | -0.18px |
| **body** | Sans | 400 | 18px | 1.4 | -0.18px |
| **body-sm** | Sans | 400 | 16px | 1.4 | -0.16px |
| **body-sm-emphasis** | Sans | 500 | 16px | 1.4 | -0.16px |
| **body-xs** | Sans | 400 | 13px | 1.4 | -0.13px |
| **body-xs-emphasis** | Sans | 500 | 13px | 1.4 | -0.13px |

**Pattern:** All letter spacing is negative (tight). Serif for h1–h3 at weight 400 (not bold). Sans for h4 and body. Apply `text-wrap: balance` to all headings. Apply `-webkit-font-smoothing: antialiased` to body.

**Font files** hosted at `https://incident.io/fonts/` (source: `github.com/incident-io/website/public/fonts/`).

### Video Typography Minimums (1920x1080)

| Element | Min Size | Recommended |
|---------|----------|-------------|
| Hero headlines | 80px | 100-140px |
| Secondary headlines | 60px | 70-100px |
| Body text | 36px | 42-56px |
| CTAs | 36px | 40-48px |
| Large stats/numbers | 120px | 160-280px |

---

## Logo

### Variations

| Variation | Background | Use Case |
|-----------|------------|----------|
| **Dark** (charcoal flame + wordmark) | White, Sand | Default — most common |
| **Light** (white flame + wordmark) | Dark surfaces, imagery | Dark backgrounds only |
| **Mono** (white on alarmalade) | Alarmalade surfaces | High-energy moments |

### Logo Rules

- Minimum size: 120px wide (digital)
- Clear space: height of the flame on all sides
- Use optical alignment, not mathematical — nudge up slightly for visual balance
- Never stretch, rotate, recolor, add gradients, or overlay on text

### Icon (Flame Only)

Use the flame icon in small spaces or when the company name is already visible (social avatars, in-page headers). The icon should never replace the full logo when introducing the brand. Never use a flame emoji as a stand-in.

**Files** (in `assets/brand/`):
```
icon-alarmalade.svg  — Orange flame (default, for sand/white backgrounds)
icon-dark.svg        — Charcoal flame (for sand/white backgrounds)
icon-light.svg       — White flame (for dark backgrounds ONLY)
wordmark-colour-dark.svg  — Full wordmark (for sand/white backgrounds)
wordmark-colour-light.svg — Full wordmark (for dark backgrounds ONLY)
```

---

## Spacing & Layout

### Grid System

10-column/row grid based on the shortest side of the frame. Flexible, not rigid — the best layouts feel balanced, not symmetrical.

### Spacing Defaults

| Concern | Default | Notes |
|---------|---------|-------|
| Page padding | 32px mobile, 48px desktop | Generous whitespace |
| Section gap | 24px | Between cards/groups |
| Element gap | 12-16px | Within a group |
| Card padding | 20-24px | Internal card padding |

### Corner Radius

| Element | Radius |
|---------|--------|
| Cards, panels | 12-16px |
| Inputs, small elements | 8px |
| Buttons, pills, badges | Full (pill-shaped) |
| Avatars | Full (circle) |

Roundness adds approachability. Keep radii consistent within a layout.

### Shadows

Prefer flat cards with borders (`border: 1px solid Dark Sand`) over shadow elevation. When shadows are needed, use soft, diffused shadows. If you notice them before the content, they're too strong.

---

## Motion & Animation

### Core Motion Language

| Element | Animation | Timing |
|---------|-----------|--------|
| **Headlines** | Rise from baseline (40-60px) | 0.5-0.8s, exponential ease out |
| **Supporting text** | Fade + slide (15-25px) | 0.3-0.5s, cubic ease out |
| **UI elements** | Pop with spring physics | Damping 8-12, stiffness 150-200 |
| **CTAs/buttons** | Bounce in with subtle overshoot | Spring, scale 0.9 to 1.0 |

### Timing Rules

- Text on screen minimum: 1.5-2 seconds
- Each beat has room to read before the next arrives
- Steady and uncluttered pacing
- Keep animations subtle and purposeful — not decorative

### CSS Transitions

For simple hover/focus effects, use `transition-colors` or `transition-all 200ms`. Reserve spring physics for layout changes, entrances, and complex sequences.

---

## Component Patterns

### Buttons

Pill-shaped (`border-radius: full`), with focus rings and hover/active states.

| Theme | Style |
|-------|-------|
| **Primary** | Alarmalade background, white text |
| **Secondary** | Sand background, charcoal text |
| **Tertiary** | Outlined, charcoal border |
| **Naked** | Text only, no background |

Sizes: Small (38px), Medium (41px), Large (49px).

### Cards

Flat with border (`1px solid Dark Sand`), rounded corners (12-16px), internal padding 20-24px. No shadow elevation by default.

### Badges / Pills

Small pill-shaped labels: `inline-flex, rounded-full, text-xs-emphasis`

| Variant | Style |
|---------|-------|
| Default | Sand background, charcoal text |
| Accent | Alarmalade/10 background, alarmalade text |
| Success | Emerald-50 background, emerald-700 text |
| Warning | Amber-50 background, amber-700 text |

### Inputs

White background, Dark Sand border, rounded-lg (8px), focus ring in Alarmalade/30.

---

## AI Image Generation Prompting

When generating images with AI tools (Gemini, DALL-E, etc.), include these brand cues in prompts:

**Always include:**
- "warm sand-toned background (#F8F5F0)" or "clean white background"
- "orange accent color (#F25533)" for highlights
- "modern, minimal, flat illustration style"
- "professional but approachable, not cold or mechanical"
- "clean layouts with generous whitespace"

**Never include:**
- Dark/black backgrounds
- Aggressive or neon colors
- Cluttered, busy compositions
- Cold steel grays as primary palette
- Stock photo aesthetic

**Example prompt:**
```
A clean, minimal illustration of an SRE engineer receiving an alert on their phone,
warm sand-toned background, orange accent highlights, modern flat design style,
professional but friendly, incident.io brand aesthetic
```

---

## Do / Don't

**Do:**
- Use semantic content tokens for text — not raw opacity modifiers
- Use the typography scale — not arbitrary sizes
- Use sentence case everywhere
- Use borders for separation — not shadows
- Keep Alarmalade purposeful — CTAs, alerts, energy
- Give interactive elements visible focus states
- Maintain generous whitespace
- Apply `-webkit-font-smoothing: antialiased`

**Don't:**
- Use black backgrounds (Charcoal is the darkest)
- Use Alarmalade for body text or large background fills
- Mix multiple corner radii in one layout
- Use generic fonts (Arial, Helvetica, Georgia)
- Use title case or all caps
- Create cluttered, busy layouts
- Use heavy shadows or drop shadows on text

---

*This is the canonical design system. The `brand-design` skill implements it in code.*
*Last updated: March 2026*
