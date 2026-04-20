"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useApp } from "@/lib/store";

export default function Header() {
  const { member, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const baseNav = [
    { href: "/jobs", label: "求人を探す" },
    { href: "/mypage/saved", label: "気になる求人" },
    { href: "/mypage/applications", label: "応募履歴" },
    { href: "/counseling", label: "面談予約" },
    { href: "/mypage", label: "マイページ" },
  ];
  const nav = member
    ? member.isAdmin
      ? [...baseNav, { href: "/admin/users", label: "管理者" }]
      : baseNav
    : [
        { href: "/jobs", label: "求人を探す" },
        { href: "/#features", label: "ACEキャリアの特徴" },
        { href: "/counseling", label: "転職支援について" },
        { href: "/faq", label: "FAQ" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-surface-line bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-[5vw]">
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
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-surface-line bg-white py-1 pl-1 pr-3 text-sm text-ink hover:bg-surface-alt"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <AvatarImage url={member.avatarUrl} name={member.name} />
                <span className="text-xs text-ink-soft">{member.name} さん</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-surface-line bg-white shadow-lg"
                >
                  <div className="border-b border-surface-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{member.name}</p>
                    <p className="truncate text-[11px] text-ink-muted">{member.email}</p>
                    {member.isAdmin && (
                      <span className="mt-1 inline-block rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                        管理者
                      </span>
                    )}
                  </div>
                  <MenuLink href="/mypage" onClick={() => setMenuOpen(false)}>
                    マイページ
                  </MenuLink>
                  <MenuLink href="/mypage/edit" onClick={() => setMenuOpen(false)}>
                    プロフィール編集
                  </MenuLink>
                  {member.isAdmin && (
                    <MenuLink href="/admin/users" onClick={() => setMenuOpen(false)}>
                      ユーザー管理
                    </MenuLink>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      setMenuOpen(false);
                      await logout();
                    }}
                    className="block w-full border-t border-surface-line px-4 py-2.5 text-left text-sm text-ink-soft hover:bg-surface-alt hover:text-brand"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
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
          <div className="flex flex-col px-[5vw] py-3">
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
                <>
                  <Link
                    href="/mypage/edit"
                    className="btn btn-outline flex-1"
                    onClick={() => setOpen(false)}
                  >
                    プロフィール編集
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setOpen(false);
                    }}
                    className="btn btn-ghost flex-1"
                  >
                    ログアウト
                  </button>
                </>
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

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-brand"
    >
      {children}
    </Link>
  );
}

function AvatarImage({ url, name }: { url: string | null; name: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white">
      {initial}
    </span>
  );
}
