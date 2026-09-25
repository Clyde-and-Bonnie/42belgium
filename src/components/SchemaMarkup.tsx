import Script from "next/script";
import type { PageContent } from "@/lib/i18n";
import type { Language } from "@/lib/themes";

interface Props {
  content: PageContent;
  lang: Language;
  canonicalUrl: string;
  siteUrl: string;
}

/**
 * Emits Course + FAQPage + BreadcrumbList JSON-LD for the page.
 * Improves organic visibility via rich snippets (FAQ dropdown, course info).
 */
export function SchemaMarkup({ content, lang, canonicalUrl, siteUrl }: Props) {
  const course = content.schemaOrg?.course;

  const graph: Record<string, unknown>[] = [];

  if (course) {
    graph.push({
      "@type": "Course",
      name: course.name,
      description: course.description,
      url: canonicalUrl,
      courseMode: course.courseMode || "blended",
      educationalLevel: course.educationalLevel,
      provider: {
        "@type": "Organization",
        name: course.provider,
        url: siteUrl,
      },
      inLanguage: lang,
    });
  }

  if (content.faq && content.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "42 Belgium",
        item: `${siteUrl}/${lang}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.hero.headline,
        item: canonicalUrl,
      },
    ],
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <Script
      id="schema-org-markup"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
