"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

type ContactModalProps = {
  recipientEmail: string;
  onClose: () => void;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactModal({ recipientEmail, onClose }: ContactModalProps) {
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data?.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection.");
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8 sm:px-6"
      style={{ background: "var(--overlay)" }}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-[0_24px_80px_rgba(0,0,0,0.45)] outline-none"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-muted)] text-foreground transition hover:border-accent"
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

        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Contact
          </p>
          <h2
            id={titleId}
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
          >
            Get in touch
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--subtext)]">
            Send a message and it will be delivered to{" "}
            <span className="text-foreground">{recipientEmail}</span>.
          </p>

          {status === "success" ? (
            <div className="mt-8 rounded-lg border border-accent/30 bg-accent/10 px-4 py-5 text-center">
              <p className="text-sm font-semibold text-foreground">
                Message sent
              </p>
              <p className="mt-1.5 text-sm text-[color:var(--subtext)]">
                Thanks — I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Close
              </button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor={nameId}
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={120}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-muted)] px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor={emailId}
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Mail
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={200}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-muted)] px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor={messageId}
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id={messageId}
                  name="message"
                  required
                  rows={5}
                  maxLength={4000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full resize-y rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-muted)] px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status === "error" && errorMessage ? (
                <p className="text-sm text-red-400" role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
