/**
 * Drop-in replacement for the old `<i className="fa-solid fa-xxx ...">` markup,
 * backed by tree-shaken inline SVGs instead of the FontAwesome JS kit.
 *
 * Accepts the exact same className string format used before (a mix of
 * `fa-solid|fa-regular|fa-brands`, an `fa-<icon>` name, and any utility
 * classes). It parses out the FA tokens and forwards the rest, so both the
 * static usages and the data-driven ones (`<Icon className={career.icon} />`)
 * keep working unchanged.
 *
 * Icons are passed to FontAwesomeIcon as imported definition OBJECTS (via the
 * map below), not looked up by string from a global library — the string-lookup
 * path logs "Could not find icon" errors when a name isn't pre-registered, which
 * showed up as browser console errors. Direct objects always resolve.
 */
import { config } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-svg-core/styles.css";

import {
  faArrowRight,
  faBars,
  faBriefcase,
  faChartLine,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleQuestion,
  faCode,
  faCompass,
  faLayerGroup,
  faListOl,
  faLocationDot,
  faMobileScreen,
  faPlay,
  faPlus,
  faRocket,
  faServer,
  faShieldHalved,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";

// We import the CSS ourselves above; stop the runtime from injecting it again.
config.autoAddCss = false;

// Keyed by the icon name (the part after `fa-`). No name collides across styles
// in this project, so a flat map is unambiguous.
const ICONS: Record<string, IconDefinition> = {
  "arrow-right": faArrowRight,
  bars: faBars,
  briefcase: faBriefcase,
  "chart-line": faChartLine,
  check: faCheck,
  "chevron-down": faChevronDown,
  "chevron-left": faChevronLeft,
  "chevron-right": faChevronRight,
  "circle-question": faCircleQuestion,
  code: faCode,
  compass: faCompass,
  "layer-group": faLayerGroup,
  "list-ol": faListOl,
  "location-dot": faLocationDot,
  "mobile-screen": faMobileScreen,
  play: faPlay,
  plus: faPlus,
  rocket: faRocket,
  server: faServer,
  "shield-halved": faShieldHalved,
  xmark: faXmark,
  "facebook-f": faFacebookF,
  instagram: faInstagram,
  "linkedin-in": faLinkedinIn,
  youtube: faYoutube,
  lightbulb: faLightbulb,
};

interface IconProps {
  /** Same string you used in the old `<i className="...">`. */
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

export function Icon({ className = "", ...rest }: IconProps) {
  let name: string | null = null;
  const passthrough: string[] = [];

  for (const token of className.split(/\s+/).filter(Boolean)) {
    if (token === "fa-solid" || token === "fa-regular" || token === "fa-brands") {
      // style prefix — the name alone is enough to resolve the object
    } else if (token.startsWith("fa-")) {
      name = token.slice(3);
    } else {
      passthrough.push(token);
    }
  }

  const def = name ? ICONS[name] : null;
  if (!def) return null;

  return (
    <FontAwesomeIcon
      icon={def}
      className={passthrough.join(" ") || undefined}
      {...rest}
    />
  );
}
