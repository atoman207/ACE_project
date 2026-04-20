"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-x py-16 text-sm text-ink-muted">読み込み中...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "ログインに失敗しました。");
        return;
      }
      login(data.member);
      const next = search?.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      router.push(safeNext ?? (data.member?.isAdmin ? "/admin/users" : "/mypage"));
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-surface-warm">
      <div className="container-x py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <p className="section-kicker">LOG IN</p>
            <h1 className="font-serif text-3xl font-bold text-ink">ログイン</h1>
          </div>

          <form onSubmit={submit} className="card p-8">
            {error && (
              <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <label className="mb-4 block">
              <span className="label">メールアドレス</span>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="mb-2 block">
              <span className="label">パスワード</span>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <div className="mb-5 text-right">
              <Link href="/password-reset" className="text-xs text-ink-muted hover:underline">
                パスワードを忘れた方はこちら
              </Link>
            </div>

            <button disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
              {submitting ? "ログイン中..." : "ログイン"}
            </button>

            <p className="mt-5 text-center text-xs text-ink-muted">
              会員でない方は
              <Link href="/register" className="link ml-1">
                こちらから無料会員登録
              </Link>
            </p>
          </form>

          <div className="mt-5 rounded-md border border-dashed border-surface-line bg-white p-5 text-center text-xs text-ink-muted">
            LINEを利用した相談・ログインサポートも可能です
            <Link href="/line" className="link ml-2">
              LINEで相談する →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
