import { urlFor } from "@/lib/sanity/image";
import type { Project } from "@/types/project";

const DEFAULT_CASE_STUDY = "/assets/case-studies/freeze-frame-landing.png";

/**
 * Resolve stacked landing-page image URLs for the project modal.
 * Prefers Sanity `caseStudyImages[]`, then legacy singular image, then local fallbacks.
 */
export function resolveCaseStudySrcs(project: Project): string[] {
  const fromArray =
    project.caseStudyImages
      ?.map((image) =>
        urlFor(image)?.width(2400).quality(100).fit("max").url(),
      )
      .filter((url): url is string => Boolean(url)) ?? [];

  if (fromArray.length > 0) return fromArray;

  const legacySingle = project.caseStudyImage
    ? urlFor(project.caseStudyImage)?.width(2400).quality(100).fit("max").url()
    : null;
  if (legacySingle) return [legacySingle];

  if (project.caseStudySrcs?.length) return project.caseStudySrcs;
  if (project.caseStudySrc) return [project.caseStudySrc];

  return [DEFAULT_CASE_STUDY];
}

export { DEFAULT_CASE_STUDY };
