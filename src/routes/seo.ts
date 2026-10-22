/**
 * What search engines and link previews are told about each page.
 *
 * This file is read in two places, so it must stay free of browser and app imports:
 * the router applies it on every navigation, and the build (vite.config.ts) uses it
 * to write a ready-made HTML file per public page plus the sitemap. A link preview
 * never runs JavaScript, so without those files every shared link would show the
 * home page's title and description.
 */
export const SITE_URL = "https://dolancer.vercel.app";
export const SITE_NAME = "Dolancer";

export interface PageSeo {
  /** The path this entry covers, including anything beneath it. */
  path: string;
  title: string;
  description: string;
  /** Whether search engines should list the page. Signed-in pages never are. */
  index: boolean;
}

const page = (path: string, title: string, description: string, index = true): PageSeo => ({
  path,
  title,
  description,
  index,
});

const ACCOUNT = "Your Dolancer account.";

export const HOME: PageSeo = page(
  "/",
  "Dolancer: Freelance work in India. Fixed pay, no bidding.",
  "Get freelance projects sent to you by a supervisor. No bidding, pay fixed before you start, and money paid to your bank or UPI. Free to join.",
);

/** Matched by prefix, so a longer path is listed before the shorter one it starts with. */
export const PAGES: readonly PageSeo[] = [
  page(
    "/how-it-works",
    "How it works: sign up, get offers, get paid | Dolancer",
    "See how Dolancer works in four steps: sign up, get verified, accept a project offer with fixed pay, and get paid to your bank or UPI after approval.",
  ),
  page(
    "/contact",
    "Contact support | Dolancer",
    "Talk to a real person at Dolancer about payments, verification, your project or your account. Support is open 24 hours a day, 7 days a week.",
  ),
  page(
    "/legal/privacy",
    "Privacy Policy | Dolancer",
    "What personal data Dolancer collects, why, who sees it, how long it is kept, and how to ask for a copy or for deletion.",
  ),
  page(
    "/legal/allowed-work",
    "Allowed Work | Dolancer",
    "The kinds of work Dolancer accepts and the work it does not take, including academic work, copied work and anything illegal.",
  ),
  page(
    "/legal/payouts",
    "Payouts and Tax | Dolancer",
    "How and when Dolancer pays you: fixed pay per offer, release after approval, UPI or bank transfer, and tax deducted where the law requires.",
  ),
  page(
    "/legal/grievance",
    "Grievances | Dolancer",
    "How to raise a complaint with Dolancer support or the grievance officer, and what happens after you do.",
  ),
  page(
    "/legal/terms",
    "Terms and Conditions | Dolancer",
    "The rules for working on Dolancer: offers, doing the work, review, payouts, and the rights you and Dolancer have.",
  ),
  page(
    "/sign-up",
    "Sign up | Dolancer",
    "Create your free Dolancer account and start getting project offers with fixed pay.",
  ),
  page("/sign-in", "Log in | Dolancer", "Log in to your Dolancer account.", false),
  page("/onboarding", "Set up your account | Dolancer", ACCOUNT, false),
  page("/guidelines", "Guidelines | Dolancer", ACCOUNT, false),
  page("/dashboard", "Dashboard | Dolancer", ACCOUNT, false),
  page("/pool", "Assigned offers | Dolancer", ACCOUNT, false),
  page("/work", "My work | Dolancer", ACCOUNT, false),
  page("/messages", "Messages | Dolancer", ACCOUNT, false),
  page("/calendar", "Calendar | Dolancer", ACCOUNT, false),
  page("/verification", "Verification | Dolancer", ACCOUNT, false),
  page("/skills", "Skills | Dolancer", ACCOUNT, false),
  page("/training", "Training | Dolancer", ACCOUNT, false),
  page("/notifications", "Alerts | Dolancer", ACCOUNT, false),
  page("/profile", "Profile | Dolancer", ACCOUNT, false),
  page("/refer", "Referrals | Dolancer", ACCOUNT, false),
  page("/tickets", "Support | Dolancer", ACCOUNT, false),
  page("/admin", "Operations | Dolancer", ACCOUNT, false),
];

const NOT_FOUND: PageSeo = page("", "Page not found | Dolancer", "This page does not exist.", false);

/** Every page a search engine should list, home first. */
export const INDEXED_PAGES: readonly PageSeo[] = [HOME, ...PAGES.filter((entry) => entry.index)];

export function seoFor(pathname: string): PageSeo {
  if (pathname === "/" || pathname === "") return HOME;
  return (
    PAGES.find((entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`)) ?? NOT_FOUND
  );
}

export function canonicalFor(entry: PageSeo, pathname: string): string {
  return SITE_URL + (entry.index ? entry.path : pathname);
}

const escapeAttribute = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Rewrites the head of the built index.html for one page. Each pattern must match
 * the single-line tag in index.html, and the build fails loudly if one stops
 * matching, so the tags cannot drift apart unnoticed.
 */
export function renderHead(html: string, entry: PageSeo): string {
  const url = canonicalFor(entry, entry.path);
  const title = escapeAttribute(entry.title);
  const description = escapeAttribute(entry.description);
  const swaps: ReadonlyArray<readonly [RegExp, string]> = [
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`],
  ];
  let out = html;
  for (const [pattern, replacement] of swaps) {
    if (!pattern.test(out)) throw new Error(`index.html no longer contains a tag matching ${pattern}`);
    out = out.replace(pattern, replacement);
  }
  return out;
}

export function renderSitemap(lastModified: string): string {
  const rows = INDEXED_PAGES.map(
    (entry) =>
      `  <url><loc>${SITE_URL}${entry.path}</loc><lastmod>${lastModified}</lastmod></url>`,
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...rows,
    "</urlset>",
    "",
  ].join("\n");
}

/** Safe to place inside a script tag: the JSON can never close the tag early. */
export function jsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
