/**
 * External link to the 42 Belgium admission sign-up page.
 * Always opens in a new tab with noopener/noreferrer for security.
 * The destination is language-specific (FR/NL/EN) via getApplyUrl().
 */
import { getApplyUrl } from "@/lib/navigation";
import type { Language } from "@/lib/themes";

/** Legacy EN fallback URL — prefer <ApplyLink lang={lang}> or getApplyUrl(lang). */
export const APPLY_URL = getApplyUrl("en");

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Language of the page — picks the matching admission URL. Defaults to EN. */
  lang?: Language;
}

export function ApplyLink({ children, className, lang = "en" }: Props) {
  return (
    <a
      href={getApplyUrl(lang)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
