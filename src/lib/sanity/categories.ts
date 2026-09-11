import type { Category, Project, SanityImage } from "@/types/project";
import { urlForOrNull } from "@/lib/sanity/image";

const LEGACY_CATEGORY_META: Record<
  string,
  { id: string; title: string; description: string; order: number }
> = {
  ecommerce: {
    id: "category.ecommerce",
    title: "E-commerce",
    description: "Storefronts, product pages, and shopping flows",
    order: 1,
  },
  game: {
    id: "category.game",
    title: "Game",
    description: "Game UI, hubs, and interactive experiences",
    order: 2,
  },
  web3: {
    id: "category.web3",
    title: "Web 3",
    description: "Dashboards, wallets, and on-chain products",
    order: 3,
  },
  other: {
    id: "category.other",
    title: "Other",
    description: "Brand sites, tools, and custom builds",
    order: 4,
  },
};

type RawProject = Project & {
  category?: string | { _ref?: string } | null;
};

function legacySlugFromValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim().toLowerCase();
  return slug || null;
}

function hasImageAsset(image: SanityImage | null | undefined) {
  return Boolean(image?.asset?._ref || image?.url);
}

/** Resolve the category card background from Sanity (never a project thumbnail). */
export function resolveCategoryBackgroundSrc(
  category: Category,
): string | null {
  const image = category.backgroundImage;
  if (hasImageAsset(image)) {
    const built = urlForOrNull(image, (b) =>
      b.width(1600).height(1000).fit("crop").auto("format").url(),
    );
    return built || image?.url || null;
  }

  return category.backgroundSrc ?? null;
}

/** Normalize Sanity/local project rows into a stable categoryId for filtering. */
export function normalizeProject(project: RawProject): Project | null {
  const legacySlug = legacySlugFromValue(project.category);
  const legacyMeta = legacySlug ? LEGACY_CATEGORY_META[legacySlug] : null;

  const categoryId =
    project.categoryId ||
    (typeof project.category === "object" && project.category?._ref
      ? project.category._ref
      : null) ||
    legacyMeta?.id ||
    null;

  if (!categoryId) return null;

  const { category: _ignored, ...rest } = project;

  return {
    ...rest,
    categoryId,
    categorySlug:
      project.categorySlug ||
      legacySlug ||
      legacyMeta?.id.replace(/^category\./, "") ||
      null,
    categoryTitle: project.categoryTitle || legacyMeta?.title || null,
  };
}

function synthesizeFromProjects(projects: Project[]): Category[] {
  const byId = new Map<string, Category>();

  for (const project of projects) {
    if (byId.has(project.categoryId)) continue;

    const legacyKey = project.categorySlug?.toLowerCase();
    const legacy = legacyKey ? LEGACY_CATEGORY_META[legacyKey] : null;
    const fromId = project.categoryId.replace(/^category\./, "");
    const legacyFromId = LEGACY_CATEGORY_META[fromId];

    byId.set(project.categoryId, {
      _id: project.categoryId,
      title:
        project.categoryTitle ||
        legacy?.title ||
        legacyFromId?.title ||
        project.categorySlug ||
        "Category",
      slug: project.categorySlug || legacy?.id.replace(/^category\./, "") || fromId,
      description: legacy?.description || legacyFromId?.description || null,
      backgroundImage: null,
      backgroundSrc: null,
      order: legacy?.order ?? legacyFromId?.order ?? 0,
    });
  }

  return Array.from(byId.values()).sort((a, b) => a.order - b.order);
}

/**
 * Prefer CMS categories (including draft-backed ones when using drafts perspective).
 * Never inject local demo collage images over real CMS data.
 */
export function resolveCategories(
  categories: Category[] | null | undefined,
  projects: Project[],
): Category[] {
  if (categories?.length) {
    return categories.map((category) => {
      const id = category._id.replace(/^drafts\./, "");
      return {
        ...category,
        _id: id,
        backgroundSrc: null,
        order: category.order ?? 0,
      };
    });
  }

  return synthesizeFromProjects(projects);
}
