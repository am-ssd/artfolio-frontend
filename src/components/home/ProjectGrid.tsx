"use client";

import { useMemo, useState } from "react";
import { CATEGORY_FILTERS } from "@/lib/assets";
import { ProjectCard } from "@/components/home/ProjectCard";
import { ProjectModal } from "@/components/home/ProjectModal";
import type { Project, ProjectCategory, SiteSettings } from "@/types/project";

type SortMode = "recent" | "order";

type ProjectGridProps = {
  projects: Project[];
  settings: SiteSettings;
};

export function ProjectGrid({ projects, settings }: ProjectGridProps) {
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [sort, setSort] = useState<SortMode>("recent");
  const [active, setActive] = useState<Project | null>(null);

  const source = projects;

  const filtered = useMemo(() => {
    const list =
      category === "all"
        ? [...source]
        : source.filter((project) => project.category === category);

    list.sort((a, b) => {
      if (sort === "order") {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    return list;
  }, [source, category, sort]);

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
        <div className="flex flex-col gap-4 border-b border-[color:var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {CATEGORY_FILTERS.map((filter) => {
              const active = category === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() =>
                    setCategory(filter.value as "all" | ProjectCategory)
                  }
                  className={`relative pb-2 text-sm font-medium transition ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {filter.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground" />
                  )}
                </button>
              );
            })}
          </div>

          <label className="relative inline-flex items-center self-start sm:self-auto">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="appearance-none rounded-lg border border-[color:var(--border)] bg-transparent py-2 pl-4 pr-9 text-sm font-medium text-foreground outline-none transition hover:border-accent focus:border-accent"
            >
              <option value="recent" className="bg-background text-foreground">
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
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {filtered.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onOpen={setActive}
            />
          ))}
        </div>
      </div>

      {active && (
        <ProjectModal
          project={active}
          projects={source}
          settings={settings}
          onClose={() => setActive(null)}
          onSelect={setActive}
        />
      )}
    </section>
  );
}
