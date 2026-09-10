import Image from "next/image";
import type { ReactNode } from "react";
import { LOCAL_ASSETS } from "@/lib/assets";
import type { ResolvedHeroMockups } from "@/lib/sanity/heroImages";
import type { SiteSettings } from "@/types/project";

type HeroProps = {
  settings: SiteSettings;
};

type MockupProps = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  delay?: 0 | 1 | 2 | 3;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
};

function HeroMockup({
  src,
  alt = "",
  width,
  height,
  delay = 0,
  priority = false,
  className = "",
  children,
}: MockupProps) {
  return (
    <div
      className={`hero-mockup-wrap hero-mockup-wrap--${delay} ${className}`.trim()}
    >
      <div className={`hero-mockup-float hero-mockup-float--${delay}`}>
        <div className="relative">
          {children}
          <div className="hero-mockup">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto w-full"
              style={{ borderRadius: 2 }}
              priority={priority}
              fetchPriority={priority ? "high" : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryBadge({
  main,
  sub,
  size = "md",
  className = "",
}: {
  main: string;
  sub: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const isSm = size === "sm";
  return (
    <div
      className={`hero-badge ${isSm ? "h-20 w-20" : "h-24 w-24 sm:h-28 sm:w-28"} ${className}`.trim()}
      aria-hidden
    >
      <span className="hero-badge-pulse" />
      <span className="hero-badge-pulse hero-badge-pulse--delay" />
      <div className="hero-badge-core flex h-full w-full flex-col items-center justify-center rounded-full bg-accent text-center text-white shadow-[0_0_36px_rgba(0,123,255,0.5)]">
        <span
          className={`font-extrabold leading-none ${isSm ? "text-sm" : "text-xl sm:text-2xl"}`}
        >
          {main}
        </span>
        <span
          className={`mt-0.5 font-semibold ${isSm ? "text-[8px]" : "text-[11px] sm:text-xs"}`}
        >
          {sub}
        </span>
      </div>
    </div>
  );
}

function ScrollCue() {
  return (
    <a
      href="#demos"
      aria-label="Scroll to demos"
      className="hero-scroll inline-flex items-center justify-center transition hover:opacity-85"
    >
      <span className="relative inline-flex h-11 w-6 items-center justify-center xl:h-12 xl:w-7">
        <Image
          src={LOCAL_ASSETS.scrollMouse}
          alt=""
          width={28}
          height={48}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="hero-scroll-arrow relative mt-2 text-foreground"
        >
          <path
            d="M6 2.5v6M3.5 6.5 6 9l2.5-2.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

const FALLBACK_HERO: ResolvedHeroMockups = {
  topLeft: {
    src: LOCAL_ASSETS.hero.topLeft,
    alt: "Hero top-left mockup",
  },
  topRight: {
    src: LOCAL_ASSETS.hero.topRight,
    alt: "Hero top-right mockup",
  },
  bottomLeft: {
    src: LOCAL_ASSETS.hero.bottomLeft,
    alt: "Hero bottom-left mockup",
  },
  bottomRight: {
    src: LOCAL_ASSETS.hero.bottomRight,
    alt: "Hero bottom-right mockup",
  },
};

export function Hero({ settings }: HeroProps) {
  const {
    heroHeadline,
    heroHighlight,
    heroSubtext,
    categoryBadge,
    name,
    location,
    availability,
    heroMockups = FALLBACK_HERO,
  } = settings;

  const badgeLines = (categoryBadge ?? "300+ category").trim().split(/\s+/);
  const badgeMain = badgeLines[0] ?? "300+";
  const badgeSub = badgeLines.slice(1).join(" ") || "category";

  // Prefer "Biggest Personal Portfolio" / "For Designer!" even if CMS still has old "… For"
  const headlineLine = heroHeadline.replace(/\s+For$/i, "").trim();

  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-1 lg:pb-20 lg:pt-28 xl:px-3 xl:pb-24 xl:pt-32 2xl:px-4"
    >
      <div className="glow-blob left-1/2 top-20 h-[30rem] w-[30rem] -translate-x-1/2 opacity-40" />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        {/* Side columns stretch farther toward the viewport edges */}
        <div className="hidden items-center lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,18.5rem)_minmax(0,1.25fr)] lg:gap-2 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,24rem)_minmax(0,1.15fr)] xl:gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,25rem)_minmax(0,1.2fr)] 2xl:gap-8">
          {/* Left mockups */}
          <div className="flex flex-col justify-center gap-5 self-stretch py-2 xl:gap-10 xl:py-6">
            <div className="relative w-[94%] max-w-[20rem] xl:w-full xl:max-w-[22rem] 2xl:max-w-[24rem]">
              <HeroMockup
                src={heroMockups.topLeft.src}
                alt={heroMockups.topLeft.alt}
                width={498}
                height={332}
                delay={0}
                priority
              />
            </div>
            <div
              style={{ marginLeft: "50px", marginRight: "-36px" }}
              className="relative w-[88%] max-w-[18.5rem] xl:w-[96%] xl:max-w-[21rem] 2xl:max-w-[23rem]"
            >
              <HeroMockup
                src={heroMockups.bottomLeft.src}
                alt={heroMockups.bottomLeft.alt}
                width={498}
                height={332}
                delay={2}
              />
            </div>
          </div>

          {/* Center copy */}
          <div className="flex min-w-0 flex-col items-center px-1 text-center xl:px-2">
            <Image
              src={LOCAL_ASSETS.logo}
              alt=""
              width={125}
              height={125}
              className="logo-mark mb-4 h-30 w-30 object-contain xl:mb-6 xl:h-30 xl:w-30"
              priority
            />

            <h1 className="text-[1.85rem] font-bold leading-[1.18] tracking-tight text-foreground xl:text-[3.15rem] xl:leading-[1.2]">
              <span className="block">{headlineLine}</span>
              <span className="block">
                For <span className="hero-highlight">{heroHighlight}</span>
              </span>
            </h1>

            {heroSubtext && (
              <p className="mt-4 max-w-[17.5rem] text-xs leading-relaxed text-[color:var(--subtext)] xl:mt-5 xl:max-w-md xl:text-[15px]">
                {heroSubtext}
              </p>
            )}

            <div className="mt-7 xl:mt-9">
              <ScrollCue />
            </div>

            <div className="mt-7 space-y-1 text-xs xl:mt-10 xl:space-y-1.5 xl:text-[15px]">
              <p className="font-medium text-accent">Name: {name}</p>
              <p className="font-medium text-accent">Location: {location}</p>
              <p className="text-[11px] text-accent/60 xl:text-sm">
                {availability}
              </p>
            </div>
          </div>

          {/* Right mockups */}
          <div className="flex flex-col justify-center gap-5 self-stretch py-2 xl:gap-10 xl:py-6">
            <div className="relative ml-auto w-[94%] max-w-[20rem] xl:w-full xl:max-w-[22rem] 2xl:max-w-[24rem]">
              <HeroMockup
                src={heroMockups.topRight.src}
                alt={heroMockups.topRight.alt}
                width={498}
                height={332}
                delay={1}
                priority
              />
            </div>
            <div
              style={{ marginLeft: "50px", marginRight: "-12px" }}
              className="relative ml-auto w-[88%] max-w-[18.5rem] xl:w-[96%] xl:max-w-[21rem] 2xl:max-w-[23rem]"
            >
              <HeroMockup
                src={heroMockups.bottomRight.src}
                alt={heroMockups.bottomRight.alt}
                width={499}
                height={332}
                delay={3}
              >
                <CategoryBadge
                  main={badgeMain}
                  sub={badgeSub}
                  className="absolute -left-3 -top-3 z-20 scale-90 xl:-left-4 xl:-top-4 xl:scale-100"
                />
              </HeroMockup>
            </div>
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="lg:hidden">
          <div className="mx-auto max-w-lg text-center">
            <Image
              src={LOCAL_ASSETS.logo}
              alt=""
              width={125}
              height={125}
              className="logo-mark mx-auto mb-5 h-20 w-20 object-contain"
              priority
            />
            <h1 className="text-[1.85rem] font-bold leading-[1.2] tracking-tight text-foreground sm:text-4xl">
              <span className="block">{headlineLine}</span>
              <span className="block">
                For <span className="hero-highlight">{heroHighlight}</span>
              </span>
            </h1>
            {heroSubtext && (
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[color:var(--subtext)] sm:text-[15px]">
                {heroSubtext}
              </p>
            )}
            <div className="mx-auto mt-8 inline-flex">
              <ScrollCue />
            </div>
            <div className="mt-8 space-y-1.5 text-sm sm:text-[15px]">
              <p className="font-medium text-accent">Name: {name}</p>
              <p className="font-medium text-accent">Location: {location}</p>
              <p className="text-sm text-accent/60">{availability}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <HeroMockup
              src={heroMockups.topLeft.src}
              alt={heroMockups.topLeft.alt}
              width={498}
              height={332}
              delay={0}
            />
            <HeroMockup
              src={heroMockups.topRight.src}
              alt={heroMockups.topRight.alt}
              width={498}
              height={332}
              delay={1}
            />
            <HeroMockup
              src={heroMockups.bottomLeft.src}
              alt={heroMockups.bottomLeft.alt}
              width={498}
              height={332}
              delay={2}
            />
            <div className="relative">
              <HeroMockup
                src={heroMockups.bottomRight.src}
                alt={heroMockups.bottomRight.alt}
                width={499}
                height={332}
                delay={3}
              >
                <CategoryBadge
                  main={badgeMain}
                  sub={badgeSub}
                  size="sm"
                  className="absolute -left-2 -top-2 z-10"
                />
              </HeroMockup>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
