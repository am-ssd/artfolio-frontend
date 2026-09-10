import { LOCAL_ASSETS } from "@/lib/assets";
import { urlFor } from "@/lib/sanity/image";
import type { HeroMockupUrls, SanityImage, SiteSettings } from "@/types/project";

export type ResolvedHeroMockups = {
  topLeft: { src: string; alt: string };
  topRight: { src: string; alt: string };
  bottomLeft: { src: string; alt: string };
  bottomRight: { src: string; alt: string };
};

function resolveHeroMockup(
  image: SanityImage | null | undefined,
  fallbackSrc: string,
  fallbackAlt: string,
) {
  const fromSanity =
    image?.asset?._ref
      ? urlFor(image)?.width(996).quality(90).fit("max").url()
      : null;

  return {
    src: fromSanity ?? fallbackSrc,
    alt: image?.alt?.trim() || fallbackAlt,
  };
}

/** Resolve the four hero mockup URLs from Site Settings, with local fallbacks. */
export function resolveHeroImages(settings: SiteSettings): HeroMockupUrls {
  const resolved = resolveHeroMockups(settings);
  return {
    topLeft: resolved.topLeft.src,
    topRight: resolved.topRight.src,
    bottomLeft: resolved.bottomLeft.src,
    bottomRight: resolved.bottomRight.src,
  };
}

/** Resolve hero mockups with src + alt for the Hero component. */
export function resolveHeroMockups(settings: SiteSettings): ResolvedHeroMockups {
  return {
    topLeft: resolveHeroMockup(
      settings.heroTopLeft,
      LOCAL_ASSETS.hero.topLeft,
      "Hero top-left mockup",
    ),
    topRight: resolveHeroMockup(
      settings.heroTopRight,
      LOCAL_ASSETS.hero.topRight,
      "Hero top-right mockup",
    ),
    bottomLeft: resolveHeroMockup(
      settings.heroBottomLeft,
      LOCAL_ASSETS.hero.bottomLeft,
      "Hero bottom-left mockup",
    ),
    bottomRight: resolveHeroMockup(
      settings.heroBottomRight,
      LOCAL_ASSETS.hero.bottomRight,
      "Hero bottom-right mockup",
    ),
  };
}
