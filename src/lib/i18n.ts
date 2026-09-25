import type { Language, Theme } from "./themes";

/**
 * Content schema aligned with brief v2 (April 2026) and lexical matrix v3.
 * Every landing page follows this shape. Optional sections (faq, schemaOrg)
 * can be omitted per page.
 */

export interface PageMeta {
  /** <title> — 50 to 60 chars, must include Primary Query + "42 Belgium". */
  title: string;
  /** <meta description> — 140 to 160 chars, 1–2 Cluster 1 keywords inside. */
  description: string;
  /** SEO URL slug — lowercase, hyphens, no accents, 3–5 words. */
  slug: string;
  /** Primary Query from the matrix — the dominant converting keyword. */
  primaryQuery: string;
  /** All converting keywords from the matrix — each MUST appear in body. */
  convertingKeywords: string[];
  /**
   * LP Angle from the matrix (briefing v2 §4.4):
   * - "classic" — sober, decision-stage audiences (default if omitted)
   * - "bold"    — emotional/narrative, reconversion or orientation audiences
   *               (e.g. Opportunity, GenAI)
   * Currently informational; future hero variants may key off this.
   */
  lpAngle?: "classic" | "bold";
}

export interface HeroContent {
  /** Single H1 containing Primary Query or close variant. */
  headline: string;
  /** Sub-headline, typically the LP Angle (Classic or Bold). */
  subheadline: string;
  /** Reassurance microcopy shown under CTA — e.g. "No fees · No degree · …". */
  reassurance?: string;
  /** CTA button label — exact text from matrix CTA column. */
  cta: string;
  /** Optional per-page hero image (path under /public). Falls back to the
   * shared default when omitted. */
  image?: string;
  /** Alt text for the hero image when `image` is set. */
  imageAlt?: string;
}

export interface ComparisonRow {
  /** Left column cell — typically the "bad" or competing option. */
  left: string;
  /** Right column cell — typically "42 Belgium" / the winning option. */
  right: string;
}

export interface ClusterComparison {
  leftLabel: string;
  rightLabel: string;
  /**
   * Optional row-aligned criterion labels (1 per row). Rendered as the leftmost
   * column of the desktop comparison table and as section headings on mobile.
   * If omitted or shorter than rows, missing entries fall back to "Feature N".
   */
  criteria?: string[];
  rows: ComparisonRow[];
}

export interface Cluster {
  /** Cluster name from matrix — uppercase label. */
  name: string;
  /** H2 reformulated in copywriting (not verbatim cluster name). */
  heading: string;
  /** 100–150 words of copy for this section. All cluster keywords must appear naturally. */
  body: string;
  /** Keywords from the matrix cluster — referenced for validation. */
  keywords: string[];
  /** Optional bullet points rendered under the body. */
  bullets?: string[];
  /** Render this cluster with the low-barrier layout (dontAsk/lookFor chips,
   * chevron decorations). Language-agnostic trigger. */
  lowBarrier?: boolean;
  /** Optional list of things NOT required (LOW BARRIER cluster). */
  dontAsk?: string[];
  /** Optional list of qualities we look for (LOW BARRIER cluster). */
  lookFor?: string[];
  /** Optional H3 subheading to split the body in two parts. */
  subheading?: string;
  /** Optional second paragraph of body text, shown after the subheading. */
  bodyPart2?: string;
  /** Optional illustrative image (path under /public). */
  image?: string;
  /** Optional alt text for the illustrative image. */
  imageAlt?: string;
  /** When an image is set, render it on the left (default is right). */
  imageLeft?: boolean;
  /** Optional side-by-side comparison (e.g. MOOC vs 42). */
  comparison?: ClusterComparison;
  /** Optional decorative SVG (path under /public) rendered as a low-opacity
   * watermark bleeding off a section corner. */
  decoration?: string;
  /** Corner the decoration bleeds from (default "bottom-right"). */
  decorationPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Decoration opacity 0–1 (default 0.1). */
  decorationOpacity?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SchemaOrgCourse {
  name: string;
  description: string;
  provider: string;
  url: string;
  courseMode?: string;
  educationalLevel?: string;
}

export interface AfterFortySection {
  heading: string;
  description: string;
  stat: { value: string; label: string };
  careers: { icon: string; label: string }[];
  communityNote?: string;
}

export interface CurriculumPhase {
  number: string;
  title: string;
  duration: string;
  description: string;
  items: string[];
  icon?: string;
  flexibility?: string[];
  globalMobility?: string;
}

export interface WhatYouBuildSection {
  heading: string;
  intro: string;
  phases: CurriculumPhase[];
  plusNote?: string;
}

export interface VideoTestimonial {
  name: string;
  subtitle: string;
  youtubeId: string;
}

export interface RealStoriesSection {
  heading: string;
  description: string;
  videos: VideoTestimonial[];
}

export interface ApplicationStep {
  number: string;
  title: string;
  description: string;
}

export interface HowToApplySection {
  heading: string;
  steps: ApplicationStep[];
  ctaLabel: string;
  microcopy?: string;
}

export interface OpenDayCampus {
  name: string;
  address: string;
  subHeading: string;
  description: string;
  image: string;
}

export interface OpenDaysSection {
  heading: string;
  intro: string;
  campuses: OpenDayCampus[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PageContent {
  meta: PageMeta;
  hero: HeroContent;
  clusters: Cluster[];
  afterForty?: AfterFortySection;
  whatYouBuild?: WhatYouBuildSection;
  realStories?: RealStoriesSection;
  howToApply?: HowToApplySection;
  openDays?: OpenDaysSection;
  faq?: FaqItem[];
  stats?: Stat[];
  ctaFinal?: {
    title: string;
    description: string;
    cta: string;
  };
  schemaOrg?: {
    course?: SchemaOrgCourse;
  };
}

const contentCache: Partial<Record<string, PageContent>> = {};

/**
 * Sections that live in `_common/{lang}.json` and are inherited by every
 * cluster of that language unless the cluster file defines its own override.
 * Cluster-specific sections (meta/hero/clusters/faq/stats/ctaFinal/schemaOrg)
 * are NOT in this list — they're always per-cluster.
 */
const SHARED_SECTIONS = [
  "afterForty",
  "whatYouBuild",
  "realStories",
  "howToApply",
  "openDays",
] as const;

export async function getPageContent(
  theme: Theme,
  lang: Language
): Promise<PageContent> {
  const key = `${theme}-${lang}`;
  if (contentCache[key]) return contentCache[key];

  const cluster = (await import(`@/content/${theme}/${lang}.json`)) as {
    default: PageContent;
  };

  // Try to load the per-language common content. Missing file = no shared
  // sections for this language, which is fine (clusters can still define
  // their own).
  let common: Partial<PageContent> = {};
  try {
    const c = (await import(`@/content/_common/${lang}.json`)) as {
      default: Partial<PageContent>;
    };
    common = c.default;
  } catch {
    // No _common file for this language yet — keep going.
  }

  const merged: PageContent = { ...cluster.default };
  for (const section of SHARED_SECTIONS) {
    applyFallback(merged, common, section);
  }

  contentCache[key] = merged;
  return merged;
}

/**
 * If `target[key]` is undefined but `source[key]` is set, copy it across.
 * Generic over `K extends keyof PageContent` so the assignment stays type-safe
 * — both sides of the `=` resolve to `PageContent[K]`.
 */
function applyFallback<K extends keyof PageContent>(
  target: PageContent,
  source: Partial<PageContent>,
  key: K
): void {
  if (target[key] === undefined && source[key] !== undefined) {
    target[key] = source[key];
  }
}

export const languageNames: Record<Language, string> = {
  en: "English",
  fr: "Français",
  nl: "Nederlands",
};

export const uiStrings: Record<Language, { learnMore: string; nav: { home: string } }> = {
  en: { learnMore: "Learn more", nav: { home: "Home" } },
  fr: { learnMore: "En savoir plus", nav: { home: "Accueil" } },
  nl: { learnMore: "Meer informatie", nav: { home: "Home" } },
};

/**
 * Localized UI labels rendered by ProposalA. Anything that is not pulled from
 * the cluster JSON (eyebrows above section H2s, button labels for non-content
 * buttons, generic comparison fallbacks, etc.) lives here.
 *
 * Cluster-specific copy (H2s, body, CTAs that map to a real action) stays in
 * the per-cluster JSON. These strings are the chrome that wraps that copy.
 */
export interface ProposalUiStrings {
  hero: {
    eyebrow: string;
    secondaryCta: string;
  };
  cluster: {
    dontAskLabel: string;
    lookForLabel: string;
    applyCta: string;
    comparisonCriteriaFallback: string; // "Feature {n}" — uses {n} placeholder
  };
  /** Modal shown when a "what we look for" chip is clicked. */
  lookForModal: { title: string; line1: string; line2: string };
  afterForty: { eyebrow: string };
  whatYouBuild: { eyebrow: string };
  /** Labels rendered inside the program timeline (phase header + the two
   * inline section labels). Localized so NL/FR pages don't show English. */
  timeline: { phase: string; flexibility: string; globalMobility: string };
  realStories: { eyebrow: string };
  openDays: { eyebrow: string };
  howToApply: { eyebrow: string };
  faq: { eyebrow: string; heading: string };
}

export const proposalUiStrings: Record<Language, ProposalUiStrings> = {
  en: {
    hero: { eyebrow: "Free, project-based training", secondaryCta: "See the outcomes" },
    cluster: {
      dontAskLabel: "What we don't ask for",
      lookForLabel: "What we look for",
      applyCta: "Start your application",
      comparisonCriteriaFallback: "Feature {n}",
    },
    lookForModal: {
      title: "You already have what it takes.",
      line1: "Potential, drive, willingness to start - the rest we teach on campus.",
      line2: "Next step: a one-hour online logic test. Free, from home, at your own pace.",
    },
    afterForty: { eyebrow: "The outcome" },
    whatYouBuild: { eyebrow: "The program" },
    timeline: { phase: "Phase", flexibility: "Flexibility", globalMobility: "Global mobility" },
    realStories: { eyebrow: "Real students" },
    openDays: { eyebrow: "Campus visits" },
    howToApply: { eyebrow: "The path" },
    faq: { eyebrow: "FAQ", heading: "Questions" },
  },
  fr: {
    hero: { eyebrow: "Formation par projets, gratuite", secondaryCta: "Voir les résultats" },
    cluster: {
      dontAskLabel: "Ce qu'on ne te demande pas",
      lookForLabel: "Ce qu'on cherche",
      applyCta: "Démarre ta candidature",
      comparisonCriteriaFallback: "Critère {n}",
    },
    lookForModal: {
      title: "Tu as déjà ce qu'il faut.",
      line1: "Du potentiel, de la motivation, l'envie de commencer — le reste, on te l'apprend sur le campus.",
      line2: "Prochaine étape : un test de logique en ligne d'une heure. Gratuit, depuis chez toi, à ton rythme.",
    },
    afterForty: { eyebrow: "Le résultat" },
    whatYouBuild: { eyebrow: "Le programme" },
    timeline: { phase: "Phase", flexibility: "Flexibilité", globalMobility: "Mobilité internationale" },
    realStories: { eyebrow: "Vrais étudiants" },
    openDays: { eyebrow: "Visites de campus" },
    howToApply: { eyebrow: "Le parcours" },
    faq: { eyebrow: "FAQ", heading: "Questions" },
  },
  nl: {
    hero: { eyebrow: "Gratis projectgebaseerde opleiding", secondaryCta: "Bekijk de resultaten" },
    cluster: {
      dontAskLabel: "Wat we niet vragen",
      lookForLabel: "Wat we zoeken",
      applyCta: "Start je aanvraag",
      comparisonCriteriaFallback: "Criterium {n}",
    },
    lookForModal: {
      title: "Je hebt alles in huis.",
      line1: "Potentieel, drive en de wil om te beginnen — de rest leren we je op de campus.",
      line2: "Volgende stap: een online logicatest van een uur. Gratis, van thuis uit, op je eigen tempo.",
    },
    afterForty: { eyebrow: "Het resultaat" },
    whatYouBuild: { eyebrow: "Het programma" },
    timeline: { phase: "Fase", flexibility: "Flexibiliteit", globalMobility: "Wereldwijde mobiliteit" },
    realStories: { eyebrow: "Echte studenten" },
    openDays: { eyebrow: "Campusbezoeken" },
    howToApply: { eyebrow: "Het traject" },
    faq: { eyebrow: "FAQ", heading: "Vragen" },
  },
};

/**
 * Count words in plain text, stripping HTML/Markdown artefacts.
 * Used by the validator to enforce the 600–1000 word target per page.
 */
export function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

/**
 * Count occurrences of a phrase (case-insensitive) in a given text.
 */
export function countOccurrences(text: string, phrase: string): number {
  const re = new RegExp(
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
  );
  return (text.match(re) || []).length;
}

/**
 * Extract all plain-text body copy from a PageContent for validation.
 */
export function extractBodyText(content: PageContent): string {
  const parts: string[] = [
    content.hero.headline,
    content.hero.subheadline,
    content.hero.reassurance || "",
    content.hero.cta,
    ...content.clusters.flatMap((c) => [
      c.heading,
      c.body,
      c.subheading || "",
      c.bodyPart2 || "",
      ...(c.bullets || []),
      ...(c.dontAsk || []),
      ...(c.lookFor || []),
      ...(c.comparison
        ? [
            c.comparison.leftLabel,
            c.comparison.rightLabel,
            ...c.comparison.rows.flatMap((r) => [r.left, r.right]),
          ]
        : []),
    ]),
    content.afterForty?.heading || "",
    content.afterForty?.description || "",
    ...(content.afterForty?.careers || []).map((c) => c.label),
    content.afterForty?.communityNote || "",
    content.whatYouBuild?.heading || "",
    content.whatYouBuild?.intro || "",
    ...(content.whatYouBuild?.phases || []).flatMap((p) => [p.title, p.description, ...p.items]),
    content.whatYouBuild?.plusNote || "",
    content.realStories?.heading || "",
    content.realStories?.description || "",
    content.howToApply?.heading || "",
    ...(content.howToApply?.steps || []).flatMap((s) => [s.title, s.description]),
    content.howToApply?.microcopy || "",
    ...(content.faq || []).flatMap((f) => [f.question, f.answer]),
    ...(content.stats || []).flatMap((s) => [s.value, s.label]),
    content.ctaFinal?.title || "",
    content.ctaFinal?.description || "",
    content.ctaFinal?.cta || "",
  ];
  return parts.join(" ");
}
