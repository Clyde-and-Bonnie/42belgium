#!/usr/bin/env node
/**
 * SEO validator — walks src/content/ JSON files and enforces brief v2 checklist:
 *
 * Per cluster file (src/content/<theme>/<lang>.json):
 *   - Meta title: 50–60 chars
 *   - Meta description: 140–160 chars
 *   - URL slug: lowercase, hyphens, no accents, 3–5 words
 *   - Primary Query present in H1 (headline)
 *   - All converting keywords appear at least once in body
 *   - Primary Query density 1%–2% (when body ≥ 100 words)
 *   - Total body length: 600–1000 words
 *   - 100 first words contain Primary Query + ≥1 Cluster 1 keyword (briefing §4.5)
 *   - schemaOrg.course present (Course rich snippet)
 *   - faq array present and non-empty (FAQPage rich snippet)
 *   - No smart quotes (curly apostrophes) — paste-from-Word artefact
 *
 * Per JSON file (cluster + _common):
 *   - Valid JSON, and the structure the site expects: no unknown key, no
 *     missing required key, right value types (mirror of src/lib/i18n.ts)
 *   - Image audit: every /assets/... path exists in public/, lowercase-hyphenated
 *     filename, size < 200 KB
 *
 * Run: node scripts/validate-seo.mjs
 * Exit code: 0 if all pages pass, 1 if any page has errors (warnings don't fail).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, "..", "src", "content");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// --structural-only enforces just the checks that mean "this page is
// broken": the file must be valid JSON with the structure the site expects,
// and the images it points at must exist. The SEO checklist still runs and
// still prints, but as advice.
// CI uses this on pull requests so an editor is never blocked by an SEO
// judgement call; `npm run validate:seo` with no flag stays the full,
// blocking checklist for Clyde & Bonnie.
const structuralOnly = process.argv.includes("--structural-only");

const c = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

function countWords(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function countOccurrences(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(escaped, "gi")) || []).length;
}

function extractBody(content) {
  const parts = [
    content.hero?.headline,
    content.hero?.subheadline,
    content.hero?.reassurance,
    content.hero?.cta,
    ...(content.clusters || []).flatMap((cl) => [
      cl.heading,
      cl.body,
      cl.subheading,
      cl.bodyPart2,
      ...(cl.bullets || []),
      ...(cl.dontAsk || []),
      ...(cl.lookFor || []),
      ...(cl.comparison
        ? [
            cl.comparison.leftLabel,
            cl.comparison.rightLabel,
            ...(cl.comparison.criteria || []),
            ...cl.comparison.rows.flatMap((r) => [r.left, r.right]),
          ]
        : []),
    ]),
    ...(content.faq || []).flatMap((f) => [f.question, f.answer]),
    ...(content.stats || []).flatMap((s) => [s.value, s.label]),
    content.ctaFinal?.title,
    content.ctaFinal?.description,
    content.ctaFinal?.cta,
  ].filter(Boolean);
  return parts.join(" ");
}

// ── Content structure ──────────────────────────────────────────────────────
// Mirror of the PageContent types in src/lib/i18n.ts. A key the site does
// not know (e.g. "faq_typo") or a required key that is missing builds fine
// but silently drops a section from the page, so both are errors in every
// mode. Keys starting with "_" are comments and always allowed. Keep this in
// sync with i18n.ts when a content field is added.
const str = { type: "string" };
const num = { type: "number" };
const bool = { type: "boolean" };
const list = (of) => ({ type: "array", of });
const oneOf = (...values) => ({ type: "string", values });
// Keys ending in "?" are optional.
const obj = (fields) => ({ type: "object", fields });

const SHARED_SCHEMA = {
  "afterForty?": obj({
    heading: str,
    description: str,
    stat: obj({ value: str, label: str }),
    careers: list(obj({ icon: str, label: str })),
    "communityNote?": str,
  }),
  "whatYouBuild?": obj({
    heading: str,
    intro: str,
    phases: list(
      obj({
        number: str,
        title: str,
        duration: str,
        description: str,
        items: list(str),
        "icon?": str,
        "flexibility?": list(str),
        "globalMobility?": str,
      })
    ),
    "plusNote?": str,
  }),
  "realStories?": obj({
    heading: str,
    description: str,
    videos: list(obj({ name: str, subtitle: str, youtubeId: str })),
  }),
  "howToApply?": obj({
    heading: str,
    steps: list(obj({ number: str, title: str, description: str })),
    ctaLabel: str,
    "microcopy?": str,
  }),
  "openDays?": obj({
    heading: str,
    intro: str,
    campuses: list(obj({ name: str, address: str, subHeading: str, description: str, image: str })),
    ctaLabel: str,
    ctaHref: str,
  }),
};

const PAGE_SCHEMA = obj({
  meta: obj({
    title: str,
    description: str,
    slug: str,
    primaryQuery: str,
    convertingKeywords: list(str),
    "lpAngle?": oneOf("classic", "bold"),
  }),
  hero: obj({
    headline: str,
    subheadline: str,
    "reassurance?": str,
    cta: str,
    "image?": str,
    "imageAlt?": str,
  }),
  clusters: list(
    obj({
      name: str,
      heading: str,
      body: str,
      keywords: list(str),
      "bullets?": list(str),
      "lowBarrier?": bool,
      "dontAsk?": list(str),
      "lookFor?": list(str),
      "subheading?": str,
      "bodyPart2?": str,
      "image?": str,
      "imageAlt?": str,
      "imageLeft?": bool,
      "comparison?": obj({
        leftLabel: str,
        rightLabel: str,
        "criteria?": list(str),
        rows: list(obj({ left: str, right: str })),
      }),
      "decoration?": str,
      "decorationPosition?": oneOf("top-left", "top-right", "bottom-left", "bottom-right"),
      "decorationOpacity?": num,
    })
  ),
  ...SHARED_SCHEMA,
  "faq?": list(obj({ question: str, answer: str })),
  "stats?": list(obj({ value: str, label: str })),
  "ctaFinal?": obj({ title: str, description: str, cta: str }),
  "schemaOrg?": obj({
    "course?": obj({
      name: str,
      description: str,
      provider: str,
      url: str,
      "courseMode?": str,
      "educationalLevel?": str,
    }),
  }),
});

// _common/<lang>.json only holds the sections shared by every page.
const COMMON_SCHEMA = obj(SHARED_SCHEMA);

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

// Closest known key, to turn "unknown key faq_typo" into a fix.
function closestKey(key, known) {
  const dist = (a, b) => {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };
  let best = null;
  for (const k of known) {
    const a = key.toLowerCase();
    const b = k.toLowerCase();
    // "faq_old" → the known key it starts or ends with (longest wins).
    const score = a.startsWith(b) || a.endsWith(b) ? -b.length : dist(a, b);
    if (score <= Math.max(2, Math.floor(k.length / 3)) && (!best || score < best.score)) best = { k, score };
  }
  return best?.k;
}

function checkShape(value, schema, where, problems) {
  const actual = typeOf(value);
  if (actual !== schema.type) {
    problems.push(`${where} should be ${schema.type === "array" ? "a list" : `a ${schema.type}`}, found ${actual}`);
    return;
  }
  if (schema.values && !schema.values.includes(value)) {
    problems.push(`${where} is "${value}" — allowed values: ${schema.values.join(", ")}`);
  }
  if (schema.type === "array") {
    value.forEach((item, i) => checkShape(item, schema.of, `${where}[${i}]`, problems));
  }
  if (schema.type === "object") {
    const fields = Object.entries(schema.fields).map(([k, s]) => ({
      key: k.replace(/\?$/, ""),
      optional: k.endsWith("?"),
      schema: s,
    }));
    const known = fields.map((f) => f.key);
    for (const key of Object.keys(value)) {
      if (key.startsWith("_") || known.includes(key)) continue;
      const hint = closestKey(key, known);
      problems.push(`unknown key "${key}"${where ? ` in ${where}` : ""}${hint ? ` — did you mean "${hint}"?` : ""}`);
    }
    for (const f of fields) {
      const path_ = where ? `${where}.${f.key}` : f.key;
      if (value[f.key] === undefined) {
        if (!f.optional) problems.push(`missing required key "${path_}"`);
        continue;
      }
      checkShape(value[f.key], f.schema, path_, problems);
    }
  }
}

// Runs on every JSON file (cluster + _common). Returns false when the file
// can't be parsed, so the caller skips the other checks for it.
function structureCheck(filePath, isCommon) {
  const rel = path.relative(CONTENT_DIR, filePath);
  let content;
  try {
    content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    // A missing comma or a smart quote pasted from Word is the most common
    // edit mistake. Report it like any other error so the PR check shows the
    // fix instead of a Node stack trace.
    log("ERROR", rel, `invalid JSON — ${err.message}`);
    return false;
  }
  const problems = [];
  checkShape(content, isCommon ? COMMON_SCHEMA : PAGE_SCHEMA, "", problems);
  for (const p of problems) log("ERROR", rel, p);
  return true;
}

const results = { errors: 0, warnings: 0, ok: 0, stubs: 0 };

function log(level, page, msg) {
  const color = level === "ERROR" ? c.red : level === "WARN" ? c.yellow : c.gray;
  const label = `[${level}]`.padEnd(7);
  console.log(`  ${color}${label}${c.reset} ${page} — ${msg}`);
  if (level === "ERROR") results.errors++;
  if (level === "WARN") results.warnings++;
}

function validate(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath);
  // structureCheck() already rejected files that don't parse.
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const issues = [];

  // Legacy stub detection — kept for theoretical edge cases.
  const isStub =
    content.clusters?.length === 1 &&
    content.clusters[0].name === "PLACEHOLDER";
  if (isStub) {
    results.stubs++;
    console.log(`  ${c.gray}[STUB]  ${rel} — placeholder cluster, skipping checks${c.reset}`);
    return;
  }

  // Meta title
  const titleLen = content.meta?.title?.length || 0;
  if (titleLen < 50 || titleLen > 60) {
    issues.push(["ERROR", `meta.title is ${titleLen} chars (target 50–60)`]);
  }

  // Meta description
  const descLen = content.meta?.description?.length || 0;
  if (descLen < 140 || descLen > 160) {
    issues.push(["WARN", `meta.description is ${descLen} chars (target 140–160)`]);
  }

  // Slug
  const slug = content.meta?.slug || "";
  if (!/^[a-z0-9-]+$/.test(slug)) {
    issues.push(["ERROR", `slug "${slug}" has invalid characters`]);
  }
  const slugWords = slug.split("-").filter(Boolean).length;
  if (slugWords < 3 || slugWords > 6) {
    issues.push(["WARN", `slug has ${slugWords} words (target 3–5)`]);
  }

  // Primary Query in H1
  const pq = content.meta?.primaryQuery || "";
  const h1 = content.hero?.headline || "";
  if (pq && h1) {
    const pqWords = pq.split(/[\s/,]+/).filter((w) => w.length > 2);
    const hasAny = pqWords.some((w) =>
      h1.toLowerCase().includes(w.toLowerCase())
    );
    if (!hasAny) {
      issues.push(["ERROR", `H1 "${h1}" contains none of the Primary Query tokens`]);
    }
  }

  // Body word count
  const body = extractBody(content);
  const wc = countWords(body);
  if (wc < 600) {
    issues.push(["WARN", `body has ${wc} words (target 600–1000)`]);
  } else if (wc > 1000) {
    issues.push(["WARN", `body has ${wc} words (target 600–1000)`]);
  }

  // Converting keywords coverage
  const converting = content.meta?.convertingKeywords || [];
  const missing = converting.filter((kw) => countOccurrences(body, kw) === 0);
  if (missing.length > 0) {
    issues.push([
      "ERROR",
      `missing converting keywords: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? `, +${missing.length - 3}` : ""}`,
    ]);
  }

  // Primary Query density (both bounds)
  if (pq && wc >= 100) {
    const pqPhrase = pq.split("/")[0].trim();
    const count = countOccurrences(body, pqPhrase);
    const density = (count / wc) * 100;
    if (density > 2) {
      issues.push(["WARN", `Primary Query density ${density.toFixed(1)}% (max 2%)`]);
    } else if (density < 1) {
      issues.push(["WARN", `Primary Query density ${density.toFixed(1)}% (min 1%)`]);
    }
  }

  // Briefing §4.5 — first 100 words must contain Primary Query + ≥1 Cluster 1 KW
  if (pq && content.hero && content.clusters?.[0]) {
    const cluster1 = content.clusters[0];
    const intro = [
      content.hero.headline || "",
      content.hero.subheadline || "",
      content.hero.reassurance || "",
      cluster1.heading || "",
      cluster1.body || "",
    ].join(" ");
    const introWords = intro.split(/\s+/).slice(0, 100);
    const introText = introWords.join(" ").toLowerCase();
    const pqFirst = pq.split("/")[0].trim().toLowerCase();
    if (!introText.includes(pqFirst)) {
      issues.push(["ERROR", `first 100 words missing Primary Query "${pqFirst}" (briefing §4.5)`]);
    }
    const cluster1Kw = cluster1.keywords || [];
    const hasAnyKw = cluster1Kw.some((kw) => introText.includes(kw.toLowerCase()));
    if (cluster1Kw.length > 0 && !hasAnyKw) {
      issues.push([
        "WARN",
        `first 100 words contain no Cluster 1 keyword (e.g. ${cluster1Kw.slice(0, 2).join(", ")})`,
      ]);
    }
  }

  // Schema.org Course presence
  if (!content.schemaOrg?.course) {
    issues.push(["WARN", "missing schemaOrg.course (Course rich snippet won't render)"]);
  }

  // FAQ array presence (drives FAQPage schema)
  if (!content.faq || content.faq.length === 0) {
    issues.push(["WARN", "no faq array (FAQPage rich snippet won't render)"]);
  }

  // Smart quotes (paste-from-Word artefacts) — likely inconsistent with the
  // rest of the page that uses straight apostrophes.
  const smartQuoteCount = (body.match(/[‘’]/g) || []).length;
  if (smartQuoteCount > 0) {
    const m = body.match(/(\S{0,15}[‘’]\S{0,15})/);
    issues.push([
      "WARN",
      `${smartQuoteCount} smart quote(s) found${m ? ` (e.g. "${m[0]}")` : ""} — replace with straight ' for consistency`,
    ]);
  }

  // Render result for the page
  if (issues.length === 0) {
    console.log(`  ${c.green}[OK]${c.reset}    ${rel} — ${wc} words, all checks pass`);
    results.ok++;
  } else {
    console.log(`\n  ${c.bold}${rel}${c.reset} — ${wc} words`);
    // In structural mode the SEO checklist is advice: it still prints, so the
    // editor sees what could be better, but it does not fail the run.
    for (const [level, msg] of issues) {
      log(structuralOnly && level === "ERROR" ? "WARN" : level, rel, msg);
    }
  }
}

/**
 * Image audit — runs on every JSON file (cluster + _common). Walks the file
 * text for /assets/... paths and validates each.
 */
function imageAudit(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath);
  const text = fs.readFileSync(filePath, "utf-8");
  const matches = text.match(/\/assets\/[^"\s]+\.(?:png|jpg|jpeg|webp|svg|gif)/gi) || [];
  const seen = new Set();
  for (const imgPath of matches) {
    if (seen.has(imgPath)) continue;
    seen.add(imgPath);

    const fsPath = path.join(PUBLIC_DIR, imgPath);
    if (!fs.existsSync(fsPath)) {
      log("ERROR", rel, `image not found in public/: ${imgPath}`);
      continue;
    }

    const filename = path.basename(imgPath);
    if (filename !== filename.toLowerCase() || /[\s_]/.test(filename)) {
      log("WARN", rel, `image filename not lowercase-hyphenated: ${filename}`);
    }

    // SVGs are vector and rarely a perf concern — only check raster sizes.
    if (!/\.svg$/i.test(filename)) {
      const sizeKb = fs.statSync(fsPath).size / 1024;
      if (sizeKb > 200) {
        log("WARN", rel, `image > 200 KB (${sizeKb.toFixed(0)} KB): ${imgPath}`);
      }
    }
  }
}

function checkFile(full) {
  const name = path.basename(full);
  if (!full.endsWith(".json")) return;

  // Top-level _-prefixed files are not page content.
  if (name.startsWith("_")) return;
  const isCommon = path.relative(CONTENT_DIR, full).split(path.sep).some((seg) => seg.startsWith("_"));

  // Structure and image audit run on every JSON (cluster + _common).
  if (!structureCheck(full, isCommon)) return;
  imageAudit(full);

  // SEO checks only on cluster files, not _common/.
  if (isCommon) return;
  validate(full);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    checkFile(full);
  }
}

// File arguments scope the run to just those pages. CI passes the content
// files a pull request actually touches, so an author is never blocked by
// pre-existing errors on pages they never opened. No arguments = full sweep,
// which is what `npm run validate:seo` does locally.
const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const scoped = args
  .map((a) => path.resolve(process.cwd(), a))
  .filter((p) => {
    // Keep only paths inside src/content/ that still exist (a PR may delete one).
    const rel = path.relative(CONTENT_DIR, p);
    return rel && !rel.startsWith("..") && !path.isAbsolute(rel) && fs.existsSync(p);
  });

console.log(
  `\n${c.bold}${structuralOnly ? "Content validation — structural checks" : "SEO validation — brief v2 checklist"}${c.reset}\n`
);
if (structuralOnly) {
  console.log(
    `${c.gray}Only invalid JSON, a wrong structure (unknown, missing or mistyped key) and missing images fail this run. SEO findings below are advice.${c.reset}`
  );
}
if (args.length > 0) {
  console.log(`${c.gray}Scoped to ${scoped.length} changed file(s) of ${args.length} passed.${c.reset}\n`);
  scoped.forEach(checkFile);
} else {
  walk(CONTENT_DIR);
}

console.log(
  `\n${c.bold}Summary${c.reset}: ${c.green}${results.ok} OK${c.reset}, ${c.yellow}${results.warnings} warnings${c.reset}, ${c.red}${results.errors} errors${c.reset}${results.stubs ? `, ${c.gray}${results.stubs} stubs${c.reset}` : ""}\n`
);

process.exit(results.errors > 0 ? 1 : 0);
