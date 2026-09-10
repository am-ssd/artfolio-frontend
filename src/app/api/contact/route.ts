import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

/** Google shows App Passwords as "xxxx xxxx xxxx xxxx" — SMTP needs no spaces. */
function normalizeAppPassword(value: string) {
  return value.replace(/\s+/g, "").replace(/^["']|["']$/g, "");
}

function isAuthError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; responseCode?: number };
  return err.code === "EAUTH" || err.responseCode === 535;
}

export async function POST(request: Request) {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPassRaw = process.env.GMAIL_APP_PASSWORD?.trim();
  const gmailPass = gmailPassRaw ? normalizeAppPassword(gmailPassRaw) : "";
  const contactTo =
    process.env.CONTACT_TO_EMAIL?.trim() || gmailUser || undefined;

  if (!gmailUser || !gmailPass || !contactTo) {
    return NextResponse.json(
      {
        error:
          "Contact email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
      },
      { status: 503 },
    );
  }

  if (gmailPass.length !== 16) {
    return NextResponse.json(
      {
        error:
          "GMAIL_APP_PASSWORD looks invalid. Paste the 16-character Google App Password (spaces are OK).",
      },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = asTrimmedString(body.name, 120);
  const email = asTrimmedString(body.email, 200);
  const message = asTrimmedString(body.message, 4000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, mail, and message are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const subject = `Artfolio contact from ${name}`;
  const text = [
    `New message from the Artfolio contact form`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from: `"Artfolio Contact" <${gmailUser}>`,
      to: contactTo,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject,
      text,
    });
  } catch (error) {
    console.error("Contact email failed:", error);

    if (isAuthError(error)) {
      return NextResponse.json(
        {
          error:
            "Gmail login failed. Create a new App Password for this exact account (GMAIL_USER), paste it into GMAIL_APP_PASSWORD, then restart the dev server.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
