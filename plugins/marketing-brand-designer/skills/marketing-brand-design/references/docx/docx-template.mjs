#!/usr/bin/env node
/**
 * Branded business case template for incident.io.
 * Generates a DOCX compatible with Google Docs.
 *
 * Usage:
 *   node references/docx/bizcase-template.mjs                        # → ./bizcase-template.docx
 *   node references/docx/bizcase-template.mjs ./outputs/my-case.docx # → specific path
 *
 * To customise, modify the CONTENT object below with your company's details.
 * The brand tokens, fonts, and layout are pre-configured.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  Tab,
  TabStopType,
  LevelFormat,
  convertInchesToTwip,
  HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom,
  TextWrappingType,
  TextWrappingSide,
  LineRuleType,
} from "docx";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL = join(__dirname, "../..");
const BRAND = join(SKILL, "assets", "brand");

// ─── Brand tokens ──────────────────────────────────────────────────────────

const ALARMALADE = "F25533";
const SAND = "F8F5F0";

// Semantic content colors
const CONTENT_PRIMARY = "161618"; // slate-900, 100%
const CONTENT_SECONDARY = "656567"; // slate-900, 66% on white
const CONTENT_TERTIARY = "A2A2A3"; // slate-900, 40% on white

const SERIF = "Merriweather Light";
const SANS = "Inter";
const MONO = "Roboto Mono";

// A4 page
const A4 = { width: 11906, height: 16838, orientation: "portrait" };
const MARGINS = { top: 1418, bottom: 1418, left: 1418, right: 1418 }; // 25mm

// ─── Assets ────────────────────────────────────────────────────────────────

const flame = readFileSync(join(BRAND, "icon-alarmalade.png"));
const sandPage = readFileSync(join(SKILL, "assets", "sand-page.png"));

// ─── Content (customise this) ──────────────────────────────────────────────

const CONTENT = {
  eyebrow: "Business case",
  title: ["Enhancing incident", "management at", "COMPANY with", "incident.io"],
  summary:
    "Switching from X to incident.io will save COMPANY ? hours/week in operational overhead, improve incident response times, and position us for AI-powered incident resolution...",
  timeline: "Decision Timeline:",
  problems: [
    { label: "Problem one", bullets: ["Details", "Details", "Details"] },
    { label: "Problem two", bullets: ["Details", "Details", "Details"] },
    { label: "Problem three", bullets: ["Details", "Details", "Details"] },
    { label: "Problem four", bullets: ["Details", "Details", "Details"] },
  ],
  roiTable: {
    headers: ["Area", "Current state", "With incident.io", "Time saved / impact"],
    rows: [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ],
  },
  currentSpend: ["Cost"],
  proposedPricing: ["Cost"],
  risks: [
    { label: "RISK 1: LOW / MEDIUM / HIGH", bullets: ["Details", "Details"] },
    { label: "RISK 2: LOW / MEDIUM / HIGH", bullets: ["Details", "Details"] },
  ],
  mitigations: ["Details"],
  whyNow: ["Details", "Details", "Details"],
  recommendation: "Proceed with incident.io Enterprise tier migration starting X 2026",
  phases: ["Phase 1", "Phase 2", "Phase 3"],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

const rule = () =>
  new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ALARMALADE } },
  });
const h2 = (text) =>
  new Paragraph({
    spacing: { before: 400, after: 150 },
    children: [new TextRun({ text, font: SERIF, size: 28, color: CONTENT_PRIMARY })],
  });
const body = (text) =>
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, font: SANS, size: 20, color: CONTENT_SECONDARY })],
  });
const bullet = (text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: SANS, size: 20, color: CONTENT_SECONDARY })],
  });
const boldBody = (label, text) =>
  new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: label, font: SANS, size: 20, bold: true, color: CONTENT_PRIMARY }),
      ...(text ? [new TextRun({ text, font: SANS, size: 20, color: CONTENT_SECONDARY })] : []),
    ],
  });
const underlined = (text) =>
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, font: SANS, size: 20, color: CONTENT_PRIMARY, underline: {} })],
  });
const riskLabel = (text) =>
  new Paragraph({
    spacing: { before: 150, after: 80 },
    children: [new TextRun({ text, font: SANS, size: 18, color: CONTENT_TERTIARY })],
  });
const cell = (text, opts = {}) =>
  new TableCell({
    width: { size: opts.width || 2267, type: WidthType.DXA },
    shading: opts.shaded ? { fill: SAND } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: SANS, size: 18, bold: opts.bold, color: CONTENT_PRIMARY })],
      }),
    ],
  });

const footer = new Footer({
  children: [
    new Paragraph({
      children: [
        new TextRun({ text: "AN INCIDENT.IO PUBLICATION", font: MONO, size: 14, color: CONTENT_TERTIARY }),
        new TextRun({ children: [new Tab()] }),
        new ImageRun({ data: flame, transformation: { width: 14, height: 18 } }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: 9404 }],
    }),
  ],
});

const sandBg = () =>
  new Paragraph({
    children: [
      new ImageRun({
        data: sandPage,
        transformation: { width: 794, height: 1123 }, // A4 at 9525 EMU/pt
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
          wrap: { type: TextWrappingType.NONE, side: TextWrappingSide.BOTH_SIDES },
          behindDocument: true,
        },
      }),
    ],
  });

// ─── Build ─────────────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "why-now",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.START,
            style: { paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } } },
          },
        ],
      },
    ],
  },
  styles: { default: { document: { run: { font: SANS, size: 20, color: CONTENT_PRIMARY } } } },
  sections: [
    // ═══ COVER ═══
    {
      properties: { page: { margin: MARGINS, size: A4 } },
      headers: { default: new Header({ children: [] }) },
      footers: { default: footer },
      children: [
        sandBg(),
        new Paragraph({
          spacing: { after: 400 },
          children: [new ImageRun({ data: flame, transformation: { width: 40, height: 51 } })],
        }),
        new Paragraph({ spacing: { before: 800 } }),
        new Paragraph({
          spacing: { after: 150 },
          children: [new TextRun({ text: CONTENT.eyebrow, font: SERIF, size: 32, color: ALARMALADE })],
        }),
        ...CONTENT.title.map(
          (line) =>
            new Paragraph({
              spacing: { after: 80, line: 204, lineRule: LineRuleType.AUTO }, // 0.85 line height (240 × 0.85 = 204)
              children: [new TextRun({ text: line, font: SERIF, size: 80, color: CONTENT_PRIMARY })],
            }),
        ),
      ],
    },

    // ═══ EXECUTIVE SUMMARY + PROBLEM ═══
    {
      properties: { page: { margin: MARGINS, size: A4 } },
      footers: { default: footer },
      children: [
        h2("Executive summary"),
        body(CONTENT.summary),
        boldBody(CONTENT.timeline),
        rule(),
        h2("The problem: current state pain points"),
        ...CONTENT.problems.flatMap((p, i) => [
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({ text: `${i + 1}. `, font: SANS, size: 20, color: CONTENT_PRIMARY }),
              new TextRun({ text: p.label, font: SANS, size: 20, bold: true, color: CONTENT_PRIMARY }),
            ],
          }),
          ...p.bullets.map((b) => bullet(b)),
        ]),
        rule(),
      ],
    },

    // ═══ SOLUTION + ROI ═══
    {
      properties: { page: { margin: MARGINS, size: A4 } },
      footers: { default: footer },
      children: [
        h2("The solution: what changes with incident.io"),
        body("ROI (Day 1)"),
        new Table({
          width: { size: 9070, type: WidthType.DXA },
          columnWidths: [2267, 2267, 2268, 2268], // must total 9070 (A4 width 11906 minus 2 × 1418 margins)
          rows: [
            new TableRow({ children: CONTENT.roiTable.headers.map((h) => cell(h, { bold: true, shaded: true })) }),
            ...CONTENT.roiTable.rows.map((row) => new TableRow({ children: row.map((c) => cell(c)) })),
          ],
        }),
        new Paragraph({ spacing: { before: 300 } }),
        boldBody("Cost consolidation"),
        underlined("Current annual spend:"),
        ...CONTENT.currentSpend.map((c) => bullet(c)),
        underlined("Proposed incident.io pricing:"),
        ...CONTENT.proposedPricing.map((c) => bullet(c)),
        rule(),
        h2("Risk assessment"),
        ...CONTENT.risks.flatMap((r) => [riskLabel(r.label), ...r.bullets.map((b) => bullet(b))]),
        boldBody("Mitigations:"),
        ...CONTENT.mitigations.map((m) => bullet(m)),
        rule(),
      ],
    },

    // ═══ WHY NOW + RECOMMENDATION ═══
    {
      properties: { page: { margin: MARGINS, size: A4 } },
      footers: { default: footer },
      children: [
        h2("Why now?"),
        ...CONTENT.whyNow.map(
          (item) =>
            new Paragraph({
              numbering: { reference: "why-now", level: 0 },
              spacing: { after: 80 },
              children: [new TextRun({ text: item, font: SANS, size: 20, color: CONTENT_SECONDARY })],
            }),
        ),
        rule(),
        h2("Recommendation"),
        body(CONTENT.recommendation),
        ...CONTENT.phases.map(
          (p, i) =>
            new Paragraph({
              spacing: { before: i === 0 ? 200 : 0, after: 60 },
              children: [new TextRun({ text: p, font: SANS, size: 20, bold: true, color: CONTENT_PRIMARY })],
            }),
        ),
      ],
    },
  ],
});

const buf = await Packer.toBuffer(doc);
const output = resolve(process.argv[2] || "bizcase-template.docx");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, buf);
console.log(`Saved → ${output}`);
