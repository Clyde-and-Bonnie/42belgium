export const LANGUAGES = ["en", "fr", "nl"] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = [
  "opportunity",
  "itgen",
  "cyber",
  "aiengineering",
  "scienceeng",
  "analystbi",
  "python",
  "webfullstack",
  "infra",
  "genai",
] as const;
export type Theme = (typeof THEMES)[number];

export type Priority = "P1" | "P2";

export interface ThemeConfig {
  slug: Theme;
  label: string;
  priority: Priority;
  intentSummary: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  opportunity: {
    slug: "opportunity",
    label: "Opportunity",
    priority: "P1",
    intentSummary: "IT career change / adult learner with no tech background",
  },
  itgen: {
    slug: "itgen",
    label: "IT General",
    priority: "P1",
    intentSummary: "General IT training / Coding bootcamp",
  },
  cyber: {
    slug: "cyber",
    label: "Cybersecurity",
    priority: "P1",
    intentSummary: "Cybersecurity specialisation",
  },
  aiengineering: {
    slug: "aiengineering",
    label: "AI Engineering",
    priority: "P1",
    intentSummary: "AI / Machine Learning engineering",
  },
  scienceeng: {
    slug: "scienceeng",
    label: "Data Science",
    priority: "P1",
    intentSummary: "Data Science / ML engineering",
  },
  analystbi: {
    slug: "analystbi",
    label: "Data Analyst / BI",
    priority: "P2",
    intentSummary: "Data Analyst / BI tools (Power BI, SQL, Tableau)",
  },
  python: {
    slug: "python",
    label: "Python",
    priority: "P2",
    intentSummary: "Python programming",
  },
  webfullstack: {
    slug: "webfullstack",
    label: "Web Fullstack",
    priority: "P2",
    intentSummary: "Fullstack web development",
  },
  infra: {
    slug: "infra",
    label: "Infrastructure",
    priority: "P2",
    intentSummary: "DevOps / Sysadmin / Networking",
  },
  genai: {
    slug: "genai",
    label: "Generative AI",
    priority: "P2",
    intentSummary: "Generative AI / Prompt Engineering",
  },
};

export function isValidTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme);
}

export function isValidLanguage(value: string): value is Language {
  return LANGUAGES.includes(value as Language);
}

/**
 * SEO URL slugs per theme × language — derived from Primary Query of the
 * lexical matrix v3. Slugs land in the URL (e.g. /en/free-training-remote-jobs)
 * and help Quality Score by signalling relevance to Google.
 *
 * Pattern: lowercase, hyphens, no accents, 3–5 words, reflects Primary Query.
 */
export const themeSlugs: Record<Theme, Record<Language, string>> = {
  opportunity: {
    en: "free-training-remote-jobs",
    fr: "formation-professionnelle-bruxelles",
    nl: "omscholing-welke-opleiding",
  },
  itgen: {
    en: "coding-bootcamp-belgium",
    fr: "formation-informatique-bruxelles",
    nl: "ict-opleiding-brussel",
  },
  cyber: {
    en: "cyber-security-course",
    fr: "formation-cybersecurite-bruxelles",
    nl: "cyber-security-opleiding",
  },
  aiengineering: {
    en: "artificial-intelligence-master-program",
    fr: "formation-intelligence-artificielle",
    nl: "opleiding-artificial-intelligence",
  },
  scienceeng: {
    en: "data-science-master",
    fr: "formation-data-scientist",
    nl: "data-scientist-opleiding",
  },
  analystbi: {
    en: "data-analyst-bootcamp",
    fr: "formation-data-analyst",
    nl: "opleiding-data-analist",
  },
  python: {
    en: "python-course-certification",
    fr: "apprendre-python-bruxelles",
    nl: "python-cursus-beginners",
  },
  webfullstack: {
    en: "full-stack-developer-course",
    fr: "formation-developpeur-web",
    nl: "fullstack-developer-opleiding",
  },
  infra: {
    en: "devops-course-infrastructure",
    fr: "formation-devops-administrateur",
    nl: "devops-opleiding-systeembeheer",
  },
  genai: {
    en: "prompt-engineering-course",
    fr: "formation-prompt-engineering-ia",
    nl: "prompt-engineering-cursus",
  },
};

export function getSlug(theme: Theme, lang: Language): string {
  return themeSlugs[theme][lang];
}

export function getThemeFromSlug(
  lang: Language,
  slug: string
): Theme | null {
  for (const theme of THEMES) {
    if (themeSlugs[theme][lang] === slug) return theme;
  }
  return null;
}
