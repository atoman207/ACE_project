"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { useApp } from "@/lib/store";

export default function Header() {
  const { member, logout } = useApp();
  const [open, setOpen] = useState(false);

  const nav = member
    ? [
        { href: "/jobs", label: "求人を探す" },
        { href: "/mypage/saved", label: "気になる求人" },
        { href: "/mypage/applications", label: "応募履歴" },
        { href: "/counseling", label: "面談予約" },
        { href: "/mypage", label: "マイページ" },
      ]
    : [
        { href: "/jobs", label: "求人を探す" },
        { href: "/#features", label: "ACEキャリアの特徴" },
        { href: "/counseling", label: "転職支援について" },
        { href: "/faq", label: "FAQ" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {member ? (
            <>
              <span className="text-xs text-ink-muted">
                {member.name} さん
              </span>
              <button
                onClick={logout}
                className="btn btn-ghost !py-2 !px-3 text-sm"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost !py-2 !px-3 text-sm">
                ログイン
              </Link>
              <Link href="/register" className="btn btn-primary !py-2 !px-4 text-sm">
                無料会員登録
              </Link>
            </>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-surface-alt lg:hidden"
          aria-label="メニュー"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-line bg-white lg:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-ink-soft"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 pt-3">
              {member ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="btn btn-ghost flex-1"
                >
                  ログアウト
                </button>
              ) : (
                <>
                  <Link href="/login" className="btn btn-outline flex-1" onClick={() => setOpen(false)}>
                    ログイン
                  </Link>
                  <Link href="/register" className="btn btn-primary flex-1" onClick={() => setOpen(false)}>
                    無料会員登録
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
