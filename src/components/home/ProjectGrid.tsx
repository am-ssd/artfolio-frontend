"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ProjectModal } from "@/components/home/ProjectModal";
import type { Category, Project, SiteSettings } from "@/types/project";

type SortMode = "recent" | "order";

type ProjectGridProps = {
  categories: Category[];
  projects: Project[];
  settings: SiteSettings;
};

export function ProjectGrid({
  categories = [],
  projects = [],
  settings,
}: ProjectGridProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("recent");
  const [active, setActive] = useState<Project | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const source = projects;

  const categoryCards = useMemo(() => {
    return (categories ?? []).map((category) => {
      console.log(category)
      const items = source.filter(
        (project) => project.categoryId === category._id,
      );
      // Only the CMS/local category background — never swap in a project thumbnail
      return {
        ...category,
        count: items.length,
        cover: category.backgroundSrc ?? null,
      };
    });
  }, [categories, source]);

  const filtered = useMemo(() => {
    if (!categoryId) return [];

    const list = source.filter((project) => project.categoryId === categoryId);

    list.sort((a, b) => {
      if (sort === "order") {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    return list;
  }, [source, categoryId, sort]);

  const selectedCategory =
    categories.find((category) => category._id === categoryId) ?? null;

  useEffect(() => {
    if (!categoryId || !projectsRef.current) return;
    projectsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [categoryId]);

  function handleCategoryClick(id: string) {
    setCategoryId((current) => (current === id ? null : id));
  }

  return (
    <section
      id="demos"
      className="relative scroll-mt-20 overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="glow-blob -left-28 top-24 h-96 w-96 opacity-25" />
      <div className="glow-blob -right-24 bottom-16 h-[28rem] w-[28rem] opacity-20" />
      <div
        className="pointer-events-none absolute -left-16 top-40 h-72 w-72 rounded-full border border-accent/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-32 h-80 w-80 rounded-full border border-accent/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Choose a category
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[color:var(--subtext)]">
              Open a card to unfold matching work samples below.
            </p>
          </div>

          {categoryId ? (
            <label className="relative inline-flex items-center self-start sm:self-auto">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="appearance-none rounded-lg border border-[color:var(--border)] bg-transparent py-2 pl-4 pr-9 text-sm font-medium text-foreground outline-none transition hover:border-accent focus:border-accent"
              >
                <option
                  value="recent"
                  className="bg-background text-foreground"
                >
                  Recent Shots
                </option>
                <option value="order" className="bg-background text-foreground">
                  Manual order
                </option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2.5 4.5 6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          ) : null}
        </div>

        {categoryCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {categoryCards.map((category) => {
              const isSelected = categoryId === category._id;
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleCategoryClick(category._id)}
                  aria-pressed={isSelected}
                  className={`group relative overflow-hidden rounded-2xl border text-left transition duration-300 ${
                    isSelected
                      ? "border-accent shadow-[0_0_0_1px_rgba(0,123,255,0.35)]"
                      : "border-[color:var(--border)] hover:border-accent/60"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[color:var(--panel-muted)]">
                    {category.cover ? (
                      <Image
                        src={category.cover}
                        alt={
                          category.backgroundImage?.alt ??
                          `${category.title} category`
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-transparent to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,27,0.92)] via-[rgba(5,10,27,0.35)] to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white sm:text-2xl">
                          {category.title}
                        </h3>
                        {category.description ? (
                          <p className="mt-1 max-w-sm text-sm text-white/70">
                            {category.description}
                          </p>
                        ) : null}
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                          isSelected
                            ? "bg-accent text-white"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {category.count}{" "}
                        {category.count === 1 ? "project" : "projects"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-8 text-center text-sm text-muted">
            No categories yet. Add categories in Sanity Studio.
          </p>
        )}

        <div
          ref={projectsRef}
          className={`scroll-mt-24 overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-out ${
            categoryId
              ? "mt-10 grid grid-rows-[1fr] opacity-100 sm:mt-12"
              : "mt-0 grid grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            {categoryId && selectedCategory ? (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border)] pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      Work samples
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">
                      {selectedCategory.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCategoryId(null)}
                    className="rounded-lg border border-[color:var(--border)] px-3 py-1.5 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground"
                  >
                    Close
                  </button>
                </div>

                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                    {filtered.map((project) => (
                      <ProjectCard
                        key={project._id}
                        project={project}
                        onOpen={setActive}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-8 text-center text-sm text-muted">
                    No projects in this category yet.
                  </p>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {active && (
        <ProjectModal
          project={active}
          projects={categoryId ? filtered : source}
          settings={settings}
          onClose={() => setActive(null)}
          onSelect={setActive}
        />
      )}
    </section>
  );
}
