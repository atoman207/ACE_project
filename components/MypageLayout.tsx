"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import AuthGuard from "./AuthGuard";

const MENU = [
  { href: "/mypage", label: "ダッシュボード" },
  { href: "/mypage/edit", label: "登録情報を編集" },
  { href: "/mypage/saved", label: "気になる求人" },
  { href: "/mypage/applications", label: "応募履歴" },
  { href: "/mypage/password", label: "パスワード変更" },
  { href: "/counseling", label: "キャリア面談案内" },
  { href: "/line", label: "LINE登録案内" },
];

export default function MypageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Inner title={title} description={description}>
        {children}
      </Inner>
    </AuthGuard>
  );
}

function Inner({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { member, savedJobIds, applications } = useApp();
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-10">
          <nav className="mb-3 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand">
              ホーム
            </Link>
            <span className="divider-dot" />
            <Link href="/mypage" className="hover:text-brand">
              マイページ
            </Link>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-sm text-ink-soft">{description}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span>
                <span className="font-semibold text-ink">{member?.name}</span> さん
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[11px]">
                気になる {savedJobIds.length} 件
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-[11px]">
                応募済 {applications.length} 件
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside>
            <ul className="card overflow-hidden">
              {MENU.map((m) => {
                const active = pathname === m.href;
                return (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      className={`flex items-center justify-between border-b border-surface-line px-4 py-3 text-sm last:border-0 ${
                        active
                          ? "bg-brand-50 text-brand font-semibold"
                          : "text-ink-soft hover:bg-surface-alt"
                      }`}
                    >
                      {m.label}
                      <span className="text-xs text-ink-faint">›</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
