import type { Category, Project } from "@/types/project";
import { LOCAL_ASSETS } from "@/lib/assets";

export const LOCAL_DEMO_CATEGORIES: Category[] = [
  {
    _id: "category.ecommerce",
    title: "E-commerce",
    slug: "ecommerce",
    description: "Storefronts, product pages, and shopping flows",
    backgroundSrc: LOCAL_ASSETS.hero.topLeft,
    order: 1,
  },
  {
    _id: "category.game",
    title: "Game",
    slug: "game",
    description: "Game UI, hubs, and interactive experiences",
    backgroundSrc: LOCAL_ASSETS.hero.bottomLeft,
    order: 2,
  },
  {
    _id: "category.web3",
    title: "Web 3",
    slug: "web3",
    description: "Dashboards, wallets, and on-chain products",
    backgroundSrc: LOCAL_ASSETS.hero.topRight,
    order: 3,
  },
  {
    _id: "category.other",
    title: "Other",
    slug: "other",
    description: "Brand sites, tools, and custom builds",
    backgroundSrc: LOCAL_ASSETS.hero.bottomRight,
    order: 4,
  },
];

const GRID_IMAGES = [
  "/assets/hero/1.png",
  "/assets/hero/2.png",
  "/assets/hero/3.png",
  "/assets/hero/377.png",
  "/assets/hero/382.png",
  "/assets/hero/401.png",
  "/assets/hero/499.png",
] as const;

const DEMO_META: Array<{
  title: string;
  categoryId: string;
  categorySlug: string;
  categoryTitle: string;
}> = [
  {
    title: "Alliance RV",
    categoryId: "category.other",
    categorySlug: "other",
    categoryTitle: "Other",
  },
  {
    title: "FreshFlow Kitchen",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Scarx Essentials",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Lux Absentia",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Pirates Hunt",
    categoryId: "category.game",
    categorySlug: "game",
    categoryTitle: "Game",
  },
  {
    title: "Pergosol Config",
    categoryId: "category.other",
    categorySlug: "other",
    categoryTitle: "Other",
  },
  {
    title: "Artfolio Fashion",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Web3 Dashboard",
    categoryId: "category.web3",
    categorySlug: "web3",
    categoryTitle: "Web 3",
  },
  {
    title: "Yacht Club",
    categoryId: "category.other",
    categorySlug: "other",
    categoryTitle: "Other",
  },
  {
    title: "Noir Watch Co",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Mobile Commerce",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
  {
    title: "Arena Game UI",
    categoryId: "category.game",
    categorySlug: "game",
    categoryTitle: "Game",
  },
  {
    title: "Token Exchange",
    categoryId: "category.web3",
    categorySlug: "web3",
    categoryTitle: "Web 3",
  },
  {
    title: "Studio Landing",
    categoryId: "category.other",
    categorySlug: "other",
    categoryTitle: "Other",
  },
  {
    title: "Market Kit",
    categoryId: "category.ecommerce",
    categorySlug: "ecommerce",
    categoryTitle: "E-commerce",
  },
];

/** Offline fallback when Sanity returns no projects. */
export const LOCAL_DEMO_PROJECTS: Project[] = DEMO_META.map((item, index) => ({
  _id: `local-demo-${index + 1}`,
  title:
    index === 0 ? "Freeze Frame Web UI Landing Page Design" : item.title,
  slug: item.title.toLowerCase().replace(/\s+/g, "-"),
  categoryId: item.categoryId,
  categorySlug: item.categorySlug,
  categoryTitle: item.categoryTitle,
  thumbnail: null,
  imageSrc: GRID_IMAGES[index % GRID_IMAGES.length],
  url: "https://www.axoper.com/",
  summary:
    "We are a creative design studio crafting distinctive brand identities that cut through noise, command attention, and endure. From strategy to execution, we transform ideas into powerful visual systems that connect, resonate, and scale.",
  caseStudySrcs: ["/assets/case-studies/freeze-frame-landing.png"],
  caseStudySrc: "/assets/case-studies/freeze-frame-landing.png",
  publishedAt: new Date(Date.UTC(2026, 0, 15 - index)).toISOString(),
  order: index + 1,
}));
