import type { Project, ProjectCategory } from "@/types/project";

export const LOCAL_ASSETS = {
  logo: "/assets/logo.png",
  contact: "/assets/contact.png",
  scrollMouse: "/assets/scroll-mouse.png",
  hero: {
    topLeft: "/assets/hero/1.png",
    topRight: "/assets/hero/2.png",
    bottomLeft: "/assets/hero/401.png",
    bottomRight: "/assets/hero/499.png",
  },
} as const;

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#demos", label: "Feature" },
  { href: "#demos", label: "All Demos" },
] as const;

export const CATEGORY_FILTERS = [
  { value: "all", label: "All" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "game", label: "Game" },
  { value: "web3", label: "Web 3" },
  { value: "other", label: "Other" },
] as const;

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
  category: ProjectCategory;
}> = [
  { title: "Alliance RV", category: "other" },
  { title: "FreshFlow Kitchen", category: "ecommerce" },
  { title: "Scarx Essentials", category: "ecommerce" },
  { title: "Lux Absentia", category: "ecommerce" },
  { title: "Pirates Hunt", category: "game" },
  { title: "Pergosol Config", category: "other" },
  { title: "Artfolio Fashion", category: "ecommerce" },
  { title: "Web3 Dashboard", category: "web3" },
  { title: "Yacht Club", category: "other" },
  { title: "Noir Watch Co", category: "ecommerce" },
  { title: "Mobile Commerce", category: "ecommerce" },
  { title: "Arena Game UI", category: "game" },
  { title: "Token Exchange", category: "web3" },
  { title: "Studio Landing", category: "other" },
  { title: "Market Kit", category: "ecommerce" },
];

/** Offline fallback when Sanity returns no projects. */
export const LOCAL_DEMO_PROJECTS: Project[] = DEMO_META.map((item, index) => ({
  _id: `local-demo-${index + 1}`,
  title:
    index === 0 ? "Freeze Frame Web UI Landing Page Design" : item.title,
  slug: item.title.toLowerCase().replace(/\s+/g, "-"),
  category: item.category,
  thumbnail: null,
  imageSrc: GRID_IMAGES[index % GRID_IMAGES.length],
  url: "https://www.axoper.com/",
  summary:
    "We are a creative design studio crafting distinctive brand identities that cut through noise, command attention, and endure. From strategy to execution, we transform ideas into powerful visual systems that connect, resonate, and scale.",
  caseStudySrc: "/assets/case-studies/freeze-frame-landing.png",
  publishedAt: new Date(Date.UTC(2026, 0, 15 - index)).toISOString(),
  order: index + 1,
}));
