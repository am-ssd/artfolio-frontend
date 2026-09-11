import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LOCAL_DEMO_PROJECTS } from "@/lib/demoContent";
import { resolveCaseStudySrcs } from "@/lib/sanity/caseStudy";
import {
  normalizeProject,
  resolveCategories,
  resolveCategoryBackgroundSrc,
} from "@/lib/sanity/categories";
import { resolveContactIllustration } from "@/lib/sanity/contactImage";
import { resolveHeroImages, resolveHeroMockups } from "@/lib/sanity/heroImages";
import {
  CATEGORIES_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import { freshFetch } from "@/sanity/client";
import type { Category, Project, SiteSettings } from "@/types/project";

const DEFAULT_SUMMARY =
  "We are a creative design studio crafting distinctive brand identities that cut through noise, command attention, and endure. From strategy to execution, we transform ideas into powerful visual systems that connect, resonate, and scale.";

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Isomiddin Abdijobborov",
  location: "Uzbekistan",
  availability: "Available for Freelance & Fulltime",
  email: "web3designer1222@gmail.com",
  telegram: "@VFX_mini",
  heroHeadline: "Biggest Personal Portfolio",
  heroHighlight: "Designer!",
  heroSubtext:
    "Our Template is full Perfect for all device. You can visit our template all device easily.",
  categoryBadge: "300+ category",
};

async function loadHomeData() {
  try {
    const [settingsResult, categoriesResult, projectsResult] =
      await Promise.all([
        freshFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
        freshFetch<Category[] | null>(CATEGORIES_QUERY),
        freshFetch<Project[] | null>(PROJECTS_QUERY),
      ]);

    return {
      settingsResult,
      categoriesResult: categoriesResult ?? [],
      projectsResult: projectsResult ?? [],
    };
  } catch (error) {
    console.error("Sanity fetch failed, using local project fallbacks:", error);
    return {
      settingsResult: null,
      categoriesResult: [] as Category[],
      projectsResult: LOCAL_DEMO_PROJECTS,
    };
  }
}

export default async function HomePage() {
  const { settingsResult, categoriesResult, projectsResult } =
    await loadHomeData();

  const settings: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...settingsResult,
  };
  settings.heroMockups = resolveHeroMockups(settings);
  settings.heroImages = resolveHeroImages(settings);
  settings.contactIllustration = resolveContactIllustration(settings);

  const normalizedProjects = (
    projectsResult.length ? projectsResult : LOCAL_DEMO_PROJECTS
  )
    .map((project) => normalizeProject(project))
    .filter((project): project is Project => Boolean(project))
    .map((project) => {
      const caseStudySrcs = resolveCaseStudySrcs(project);
      return {
        ...project,
        // Draft category refs use drafts.* — normalize to published id for filtering
        categoryId: project.categoryId.replace(/^drafts\./, ""),
        summary: project.summary ?? DEFAULT_SUMMARY,
        url: project.url ?? "https://www.axoper.com/",
        caseStudySrcs,
        caseStudySrc: caseStudySrcs[0],
      };
    });

  const resolvedCategories = resolveCategories(
    categoriesResult,
    normalizedProjects,
  ).map((category) => ({
    ...category,
    _id: category._id.replace(/^drafts\./, ""),
    backgroundSrc: resolveCategoryBackgroundSrc(category),
    order: category.order ?? 0,
  }));

  return (
    <ContactProvider recipientEmail={settings.email}>
      <Header />
      <main className="flex-1">
        <Hero settings={settings} />
        <ProjectGrid
          categories={resolvedCategories}
          projects={normalizedProjects}
          settings={settings}
        />
        <ContactSection settings={settings} />
      </main>
      <Footer availability={settings.availability} />
      <FloatingContact />
    </ContactProvider>
  );
}
