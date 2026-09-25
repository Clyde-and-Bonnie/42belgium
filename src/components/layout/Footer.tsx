import Image from "next/image";
import { Icon } from "@/components/Icon";
import type { Language } from "@/lib/themes";
import {
  getFooterLocations,
  getFooterColumns,
  getSocialLinks,
  getLegalLinks,
  getSocialHeading,
  getWorkAt42Link,
  getLanguageHeading,
} from "@/lib/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Footer.module.css";

export function Footer({ lang }: { lang: Language }) {
  const locations = getFooterLocations();
  const columns = getFooterColumns(lang);
  const socialLinks = getSocialLinks();
  const legalLinks = getLegalLinks();
  const socialHeading = getSocialHeading(lang);
  const workAt42 = getWorkAt42Link(lang);
  const languageHeading = getLanguageHeading(lang);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + locations */}
          <div>
            <Image
              src="/assets/logo-42-white.svg"
              alt="42 Belgium"
              width={140}
              height={26}
              style={{ height: "auto" }}
            />
            <div className="mt-8 space-y-6">
              {locations.map((loc, i) => (
                <div
                  key={loc.city}
                  className={i > 0 ? "pt-6 border-t border-zinc-800" : ""}
                >
                  {loc.address.split(", ").map((line, j) => (
                    <p key={j} className={styles.address}>
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Socials + Work at 42 */}
          <div>
            <p className={styles.columnHeading}>{socialHeading}</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.platform}
                >
                  <Icon className={social.icon} />
                </a>
              ))}
            </div>
            <p className={`${styles.columnHeading} mt-10`}>{workAt42.heading}</p>
            <a
              href={workAt42.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.columnLink}
            >
              {workAt42.label}
            </a>
          </div>

          {/* Col 3: 42 Belgium nav */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className={styles.columnHeading}>{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.columnLink}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: Language switcher */}
          <div>
            <p className={styles.columnHeading}>{languageHeading}</p>
            <LanguageSwitcher current={lang} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            © 42 Belgium - All rights reserved
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.legalLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
