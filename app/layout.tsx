import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: {
    default: "ACEキャリア｜アクチュアリー特化の会員制転職プラットフォーム",
    template: "%s｜ACEキャリア",
  },
  description:
    "現役アクチュアリーが支援する、アクチュアリー・保険数理人材のための会員制求人サイト。100件以上の紹介可能求人、非公開求人、無理な転職勧奨のない転職支援。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">
        <AppProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
