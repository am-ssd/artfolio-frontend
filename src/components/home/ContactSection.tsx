"use client";

import Image from "next/image";
import { useContact } from "@/components/contact/ContactContext";
import { LOCAL_ASSETS } from "@/lib/assets";
import type { SiteSettings } from "@/types/project";

type ContactSectionProps = {
  settings: SiteSettings;
};

export function ContactSection({ settings }: ContactSectionProps) {
  const { email, telegram, discord } = settings;
  const { openContact } = useContact();

  return (
    <section id="contact" className="relative mt-6 scroll-mt-20">
      <div className="relative overflow-hidden bg-contact pb-20 pt-20 text-white sm:pt-24">
        <svg
          className="absolute inset-x-0 top-0 h-20 w-full text-background"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,40 C180,70 360,10 540,35 C720,60 900,75 1080,40 C1260,5 1350,20 1440,35 L1440,0 L0,0 Z"
          />
        </svg>

        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, rgba(255,255,255,0.25), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.18), transparent 40%)",
          }}
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <div className="flex justify-center lg:justify-start">
            <Image
              src={LOCAL_ASSETS.contact}
              alt="Contact illustration"
              width={480}
              height={360}
              className="h-auto w-full max-w-lg object-contain drop-shadow-xl"
            />
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="shrink-0"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M4 7l8 6 8-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Please contact me
            </h2>
            <dl className="mt-8 space-y-4 text-base sm:text-lg">
              <div>
                <dt className="inline font-semibold">Email: </dt>
                <dd className="inline">
                  <button
                    type="button"
                    onClick={openContact}
                    className="underline-offset-2 hover:underline"
                  >
                    {email}
                  </button>
                </dd>
              </div>
              {telegram && (
                <div>
                  <dt className="inline font-semibold">Telegram: </dt>
                  <dd className="inline">
                    <a
                      href={`https://t.me/${telegram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-2 hover:underline"
                    >
                      {telegram}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
