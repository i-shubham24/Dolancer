import { canonicalFor, seoFor } from "./seo";

function set(selector: string, attribute: "content" | "href", value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/** Keeps the title, description, canonical address and preview tags in step with the page. */
export function applySeo(pathname: string): void {
  const entry = seoFor(pathname);
  const url = canonicalFor(entry, pathname);

  document.title = entry.title;
  set('meta[name="description"]', "content", entry.description);
  set('link[rel="canonical"]', "href", url);
  set('meta[name="robots"]', "content", entry.index ? "index, follow" : "noindex, nofollow");
  set('meta[property="og:title"]', "content", entry.title);
  set('meta[property="og:description"]', "content", entry.description);
  set('meta[property="og:url"]', "content", url);
  set('meta[name="twitter:title"]', "content", entry.title);
  set('meta[name="twitter:description"]', "content", entry.description);
}
