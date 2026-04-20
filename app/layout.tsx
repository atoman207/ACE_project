import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/lib/store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.acecareer.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ACEキャリア｜アクチュアリー特化の会員制転職プラットフォーム",
    template: "%s｜ACEキャリア",
  },
  description:
    "現役アクチュアリーが支援する、アクチュアリー・保険数理人材のための会員制求人サイト。100件以上の紹介可能求人、非公開求人、無理な転職勧奨のない転職支援。",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ACEキャリア",
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">
        <AppProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </AppProvider>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
