export type SanityImage = {
  _key?: string;
  asset?: {
    _ref: string;
    _type: "reference";
  };
  /** Present when GROQ projects asset->url */
  url?: string;
  alt?: string | null;
};

/** @deprecated Use SanityImage */
export type CaseStudyImage = SanityImage;

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  backgroundImage?: SanityImage | null;
  /** Resolved CDN/local URL for the category card background */
  backgroundSrc?: string | null;
  order: number;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  /** Category document id used for filtering */
  categoryId: string;
  /** Display / legacy slug (ecommerce, game, …) */
  categorySlug?: string | null;
  categoryTitle?: string | null;
  thumbnail?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
  } | null;
  /** Local public path used when Sanity thumbnail is absent */
  imageSrc?: string | null;
  url?: string | null;
  /** Short copy shown in the fixed modal intro */
  summary?: string | null;
  /** Stacked full-page screenshots scrolled continuously in the modal */
  caseStudyImages?: SanityImage[] | null;
  /** @deprecated Prefer caseStudyImages; kept for older documents */
  caseStudyImage?: SanityImage | null;
  /** Resolved CDN/local URLs for the scrollable landing stack */
  caseStudySrcs?: string[] | null;
  /** @deprecated Prefer caseStudySrcs */
  caseStudySrc?: string | null;
  publishedAt: string;
  order: number;
};

export type HeroMockupUrls = {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
};

export type SiteSettings = {
  name: string;
  location: string;
  availability: string;
  email: string;
  telegram?: string | null;
  discord?: string | null;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtext?: string | null;
  categoryBadge?: string | null;
  heroTopLeft?: SanityImage | null;
  heroTopRight?: SanityImage | null;
  heroBottomLeft?: SanityImage | null;
  heroBottomRight?: SanityImage | null;
  /** Contact section illustration */
  contactImage?: SanityImage | null;
  /** Resolved hero mockup URLs (Sanity CDN or local fallbacks) */
  heroImages?: HeroMockupUrls;
  /** Resolved hero mockups with alt text */
  heroMockups?: {
    topLeft: { src: string; alt: string };
    topRight: { src: string; alt: string };
    bottomLeft: { src: string; alt: string };
    bottomRight: { src: string; alt: string };
  };
  /** Resolved contact illustration (Sanity CDN or local fallback) */
  contactIllustration?: { src: string; alt: string };
};
