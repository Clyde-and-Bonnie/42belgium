import type { Metadata } from "next";
import type { Language, Theme } from "./themes";
import { LANGUAGES, getSlug } from "./themes";
import { getPageContent } from "./i18n";

/**
 * Canonical site URL — set via env or fall back to 42belgium.be.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://42belgium.be";

/**
 * Build the canonical URL for a given theme × language page.
 */
export function canonicalUrl(theme: Theme, lang: Language): string {
  return `${SITE_URL}/${lang}/${getSlug(theme, lang)}`;
}

/**
 * Generate Next.js Metadata from a PageContent — consistent across all pages.
 * Includes:
 *   - title + description (from brief v2 section 4.1 / 4.2)
 *   - hreflang alternates for all 3 languages
 *   - canonical URL
 *   - Open Graph + Twitter cards
 */
export async function buildMetadata(
  theme: Theme,
  lang: Language
): Promise<Metadata> {
  const content = await getPageContent(theme, lang);
  const canonical = canonicalUrl(theme, lang);

  const languageAlternates = Object.fromEntries(
    LANGUAGES.map((l) => [l, `${SITE_URL}/${l}/${getSlug(theme, l)}`])
  );

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: canonical,
      siteName: "42 Belgium",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
