"use client";

import Image from "next/image";
import { useState } from "react";
import { useContact } from "@/components/contact/ContactContext";
import { LOCAL_ASSETS } from "@/lib/assets";

export function FloatingContact() {
  const [visible, setVisible] = useState(true);
  const { openContact } = useContact();

  if (!visible) return null;

  return (
    <aside
      className="pointer-events-none fixed bottom-5 left-4 z-[60] sm:bottom-8 sm:left-6"
      aria-label="Contact availability"
    >
      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss contact prompt"
          className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-muted)] text-foreground shadow-[0_0_12px_rgba(0,123,255,0.35)] transition hover:border-accent"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
            <path
              d="M3 3l6 6M9 3 3 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="relative isolate">
          <span className="floating-contact-pulse" aria-hidden />
          <span
            className="floating-contact-pulse floating-contact-pulse--delay"
            aria-hidden
          />

          <div className="relative z-10 flex min-w-[240px] items-center gap-3 rounded-[3px] border border-[color:var(--border)] bg-[color:var(--panel)] py-2.5 pl-2.5 pr-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)] sm:min-w-[260px] sm:gap-3.5 sm:pr-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent sm:h-14 sm:w-14">
              <Image
                src={LOCAL_ASSETS.logo}
                alt=""
                width={34}
                height={34}
                className="logo-mark h-auto w-[34px]"
              />
            </div>

            <div className="min-w-0 pr-1">
              <p className="text-[12px] font-medium leading-tight text-muted sm:text-[13px]">
                Available for new projects
              </p>
              <button
                type="button"
                onClick={openContact}
                className="mt-1.5 inline-flex rounded-lg bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-accent-soft sm:text-[13px]"
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
