"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContact } from "@/components/contact/ContactContext";
import { LOCAL_ASSETS } from "@/lib/assets";
import { DEFAULT_CASE_STUDY } from "@/lib/sanity/caseStudy";
import { urlFor } from "@/lib/sanity/image";
import type { Project, SiteSettings } from "@/types/project";

const DEFAULT_SUMMARY =
  "We are a creative design studio crafting distinctive brand identities that cut through noise, command attention, and endure. From strategy to execution, we transform ideas into powerful visual systems that connect, resonate, and scale.";

type ProjectModalProps = {
  project: Project;
  projects: Project[];
  settings: SiteSettings;
  onClose: () => void;
  onSelect: (project: Project) => void;
};

function projectThumb(project: Project) {
  const sanityUrl = project.thumbnail
    ? urlFor(project.thumbnail)?.width(640).height(480).url()
    : null;
  return sanityUrl ?? project.imageSrc ?? null;
}

export function ProjectModal({
  project,
  projects,
  settings,
  onClose,
  onSelect,
}: ProjectModalProps) {
  const { openContact } = useContact();
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    scrollRef.current?.scrollTo({ top: 0 });
    return () => {
      document.body.style.overflow = previous;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [project._id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
  }, []);

  const scrollCarousel = useCallback((direction: -1 | 1) => {
    const node = carouselRef.current;
    if (!node) return;
    node.scrollBy({
      left: direction * Math.max(220, node.clientWidth * 0.65),
      behavior: "smooth",
    });
  }, []);

  const liveUrl = project.url ?? "https://www.axoper.com/";
  const summary = project.summary ?? DEFAULT_SUMMARY;
  const caseStudySrcs =
    project.caseStudySrcs?.length
      ? project.caseStudySrcs
      : project.caseStudySrc
        ? [project.caseStudySrc]
        : [DEFAULT_CASE_STUDY];
  const related = projects.filter((item) => item._id !== project._id);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--overlay)" }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-none border-0 bg-background outline-none"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--panel)] text-foreground shadow transition hover:border-accent"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`project-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain${
            isScrolling ? " is-scrolling" : ""
          }`}
        >
          {/* Intro scrolls with content (not fixed) */}
          <header className="bg-background px-6 pb-8 pt-14 text-center sm:px-12 sm:pb-10 sm:pt-16">
            <h2
              id="project-modal-title"
              className="mx-auto max-w-3xl text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl"
            >
              {project.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--subtext)] sm:text-[15px]">
              {summary}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted">
              Currently implemented website link:{" "}
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 transition hover:text-accent-soft"
              >
                {liveUrl}
              </a>
            </p>
          </header>

          <div className="relative flex w-full flex-col gap-0 bg-white leading-[0]">
            {/* Stacked full-bleed screenshots — scroll continuously as one landing page */}
            {caseStudySrcs.map((src, index) => {
              const sanityImage =
                project.caseStudyImages?.[index] ??
                (index === 0 ? project.caseStudyImage : undefined);
              const alt =
                sanityImage?.alt ??
                `${project.title} landing page${
                  caseStudySrcs.length > 1 ? ` · part ${index + 1}` : ""
                }`;

              return (
                // Serve original pixels — no Next.js optimizer downscale
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={sanityImage?._key ?? `${project._id}-landing-${index}`}
                  src={src}
                  alt={alt}
                  className="m-0 block h-auto w-full max-w-none p-0"
                  decoding="async"
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{ imageRendering: "auto", verticalAlign: "top" }}
                />
              );
            })}
          </div>

          <footer className="border-0 bg-background px-4 pb-10 pt-12 text-center sm:px-6 sm:pb-12 sm:pt-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[color:var(--panel)] ring-2 ring-accent/35">
              <Image
                src={LOCAL_ASSETS.logo}
                alt=""
                width={36}
                height={36}
                className="logo-mark"
              />
            </div>

            <button
              type="button"
              onClick={openContact}
              className="mt-5 inline-block text-base font-medium text-accent transition hover:text-accent-soft sm:text-lg"
            >
              {settings.name}
            </button>

            <div className="mt-5">
              <button
                type="button"
                onClick={openContact}
                className="inline-flex rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Get in touch
              </button>
            </div>

            <div className="relative mx-auto mt-10 max-w-4xl">
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous related projects"
                className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--panel)] text-foreground transition hover:border-accent"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M14.5 6.5 9 12l5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto scroll-smooth px-11 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {related.map((item) => {
                  const src = projectThumb(item);
                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => onSelect(item)}
                      className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg bg-[color:var(--panel)] sm:h-32 sm:w-44"
                      aria-label={`Open ${item.title}`}
                    >
                      {src ? (
                        <Image
                          src={src}
                          alt={item.title}
                          fill
                          sizes="176px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">
                          {item.title}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Next related projects"
                className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--panel)] text-foreground transition hover:border-accent"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M9.5 6.5 15 12l-5.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>,
    document.body,
  );
}
