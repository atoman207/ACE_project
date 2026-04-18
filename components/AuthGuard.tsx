"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { member } = useApp();

  if (!member) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-lg rounded-lg border border-surface-line bg-white p-8 text-center">
          <p className="text-sm font-semibold text-ink">
            このページは会員限定です
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            ログインまたは会員登録（無料）をお願いします。
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Link href="/login" className="btn btn-primary">
              ログイン
            </Link>
            <Link href="/register" className="btn btn-outline">
              無料会員登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
