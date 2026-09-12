import { useEffect } from "react";

import { env } from "@/config/env";

export interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Lightweight SEO helper for SPA routes (no react-helmet dependency).
 * Sets document title, description, OG/Twitter tags, canonical, and optional JSON-LD.
 */
export function SeoHead({
  title,
  description,
  canonicalPath = "/",
  ogImage,
  noIndex = false,
  jsonLd,
}: SeoHeadProps) {
  useEffect(() => {
    const origin = env.VITE_APP_URL.replace(/\/$/, "");
    const canonical = `${origin}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
    const image = ogImage ?? `${origin}/og-image.png`;

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:site_name", env.VITE_APP_NAME);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertLink("canonical", canonical);

    if (jsonLd) {
      upsertJsonLd("careerlens-jsonld", jsonLd);
    }
  }, [title, description, canonicalPath, ogImage, noIndex, jsonLd]);

  return null;
}

export default SeoHead;
