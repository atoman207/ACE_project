import type { MetadataRoute } from "next";

// Only public (non-authed) pages belong in the sitemap. Job detail pages are
// member-only, so they are excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.acecareer.jp";
  const now = new Date();
  const pages = [
    "",
    "/login",
    "/register",
    "/password-reset",
    "/counseling",
    "/line",
    "/faq",
    "/company",
    "/terms",
    "/privacy",
  ];
  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.6,
  }));
}
