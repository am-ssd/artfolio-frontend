import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LOCAL_DEMO_PROJECTS } from "@/lib/assets";
import { urlFor } from "@/lib/sanity/image";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { client } from "@/sanity/client";
import type { Project, SiteSettings } from "@/types/project";

const options = { next: { revalidate: 30 } };

const DEFAULT_SUMMARY =
  "We are a creative design studio crafting distinctive brand identities that cut through noise, command attention, and endure. From strategy to execution, we transform ideas into powerful visual systems that connect, resonate, and scale.";

const DEFAULT_CASE_STUDY = "/assets/case-studies/freeze-frame-landing.png";

const DEFAULT_SETTINGS: SiteSettings = {
  name: "Isomiddin Abdijobborov",
  location: "Uzbekistan",
  availability: "Available for Freelance & Fulltime",
  email: "web3designer1222@gmail.com",
  telegram: "@VFX_mini",
  discord: "right098",
  heroHeadline: "Biggest Personal Portfolio",
  heroHighlight: "Designer!",
  heroSubtext:
    "Our Template is full Perfect for all device. You can visit our template all device easily.",
  categoryBadge: "300+ category",
};

async function loadHomeData() {
  try {
    const [settingsResult, projectsResult] = await Promise.all([
      client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY, {}, options),
      client.fetch<Project[]>(PROJECTS_QUERY, {}, options),
    ]);
    return {
      settingsResult,
      projectsResult: projectsResult?.length
        ? projectsResult
        : LOCAL_DEMO_PROJECTS,
    };
  } catch (error) {
    console.error("Sanity fetch failed, using local fallbacks:", error);
    return {
      settingsResult: null,
      projectsResult: LOCAL_DEMO_PROJECTS,
    };
  }
}

export default async function HomePage() {
  const { settingsResult, projectsResult } = await loadHomeData();

  const settings: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...settingsResult,
  };

  const projects = projectsResult.map((project) => {
    // Request ~2x the modal content width (max-w-6xl ≈ 1152px) for sharp retina display
    const sanityCaseStudy = project.caseStudyImage
      ? urlFor(project.caseStudyImage)?.width(2400).quality(100).fit("max").url()
      : null;

    return {
      ...project,
      summary: project.summary ?? DEFAULT_SUMMARY,
      url: project.url ?? "https://www.axoper.com/",
      caseStudySrc:
        sanityCaseStudy ?? project.caseStudySrc ?? DEFAULT_CASE_STUDY,
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero settings={settings} />
        <ProjectGrid projects={projects} settings={settings} />
        <ContactSection settings={settings} />
      </main>
      <Footer availability={settings.availability} />
      <FloatingContact email={settings.email} />
    </>
  );
}
