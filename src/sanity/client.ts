import { createClient, type QueryParams } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!;

/** Prefer a dedicated read token; write token also works for draft previews. */
const previewToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

/**
 * Homepage content client.
 * - Always hits the API directly (no CDN) so category images update immediately.
 * - With a token, uses previewDrafts so unpublished Studio edits (incl. new
 *   background images) appear on the site before you click Publish.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: previewToken || undefined,
  perspective: previewToken ? "previewDrafts" : "published",
  stega: false,
});

/**
 * Server-only write client for contact form submissions.
 * Requires SANITY_API_WRITE_TOKEN (Editor or higher) — never expose to the browser.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

/** Always bypass Next.js Data Cache for CMS reads that must stay fresh. */
export const freshFetchOptions = {
  cache: "no-store" as const,
};

export async function freshFetch<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return client.fetch<T>(query, params, freshFetchOptions);
}
