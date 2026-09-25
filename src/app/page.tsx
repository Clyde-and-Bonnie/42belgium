import { redirect } from "next/navigation";
import { getSlug } from "@/lib/themes";

export default function RootPage() {
  // Homepage = the opportunity EN landing page.
  redirect(`/en/${getSlug("opportunity", "en")}`);
}
