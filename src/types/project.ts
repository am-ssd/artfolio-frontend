export type ProjectCategory = "ecommerce" | "game" | "web3" | "other";

export type Project = {
  _id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
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
  caseStudyImage?: {
    asset?: {
      _ref: string;
      _type: "reference";
    };
    alt?: string | null;
  } | null;
  /** Full-height landing-page image shown in the scrollable modal body */
  caseStudySrc?: string | null;
  publishedAt: string;
  order: number;
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
};
