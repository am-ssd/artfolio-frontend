"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useContact } from "@/components/contact/ContactContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LOCAL_ASSETS, NAV_LINKS } from "@/lib/assets";

export function Header() {
  const [open, setOpen] = useState(false);
  const { openContact } = useContact();

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-6 sm:px-8 lg:px-12">
        <Link href="#home" className="relative z-10 shrink-0">
          <Image
            src={LOCAL_ASSETS.logo}
            alt="Artfolio"
            width={48}
            height={48}
            className="logo-mark h-10 w-10 object-contain sm:h-11 sm:w-11"
            priority
          />
        </Link>

        <nav className="hidden items-center justify-center gap-10 md:flex lg:gap-12">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15px] font-semibold text-foreground transition hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={openContact}
            className="hidden rounded-lg bg-accent px-5 py-2.5 text-[15px] font-semibold text-white transition hover:bg-accent-soft md:inline-flex"
          >
            Get in touch
          </button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--border)] text-foreground md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`block h-0.5 w-full bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-foreground transition ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-full bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[color:var(--border)] bg-background/95 px-6 py-4 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-[color:var(--panel-muted)]"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openContact();
              }}
              className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get in touch
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
