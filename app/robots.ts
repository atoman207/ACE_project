import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.acecareer.jp";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/counseling", "/faq", "/terms", "/privacy", "/company", "/line", "/login", "/register", "/password-reset"],
        disallow: ["/mypage", "/admin", "/jobs", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
