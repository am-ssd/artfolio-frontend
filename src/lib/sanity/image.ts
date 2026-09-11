import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { client } from "@/sanity/client";
import type { SanityImage } from "@/types/project";

const { projectId, dataset } = client.config();

const builder =
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset })
    : null;

/** True when the image has enough data for @sanity/image-url. */
export function hasSanityImageAsset(
  source: SanityImage | SanityImageSource | null | undefined,
): source is SanityImage {
  if (!source || typeof source !== "object") return false;
  const image = source as SanityImage & { _ref?: string };
  return Boolean(image.asset?._ref || image.url || image._ref);
}

/**
 * Build a Sanity image URL builder, or null if the source has no asset.
 * Never throws on incomplete CMS image objects (empty array slots, etc.).
 */
export function urlFor(source: SanityImageSource | SanityImage | null | undefined) {
  if (!builder || !hasSanityImageAsset(source)) return null;

  try {
    return builder.image(source as SanityImageSource);
  } catch (error) {
    console.warn("urlFor: skipped invalid Sanity image source", error);
    return null;
  }
}

/** Resolve a concrete URL string, or null if the image cannot be built. */
export function urlForOrNull(
  source: SanityImageSource | SanityImage | null | undefined,
  build?: (b: NonNullable<ReturnType<typeof urlFor>>) => string | undefined,
): string | null {
  const imageBuilder = urlFor(source);
  if (!imageBuilder) return null;

  try {
    const url = build ? build(imageBuilder) : imageBuilder.url();
    return url || null;
  } catch (error) {
    console.warn("urlForOrNull: failed to build image URL", error);
    return null;
  }
}
