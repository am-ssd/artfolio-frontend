import { LOCAL_ASSETS } from "@/lib/assets";
import { urlForOrNull } from "@/lib/sanity/image";
import type { SiteSettings } from "@/types/project";

export type ResolvedContactIllustration = {
  src: string;
  alt: string;
};

/** Resolve the contact-section illustration from Site Settings. */
export function resolveContactIllustration(
  settings: SiteSettings,
): ResolvedContactIllustration {
  const fromSanity = urlForOrNull(settings.contactImage, (b) =>
    b.width(960).quality(90).fit("max").url(),
  );

  return {
    src: fromSanity ?? LOCAL_ASSETS.contact,
    alt: settings.contactImage?.alt?.trim() || "Contact illustration",
  };
}
