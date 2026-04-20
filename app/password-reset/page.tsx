"use client";

import Link from "next/link";
import { useState } from "react";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "送信に失敗しました。");
        return;
      }
      setDone(true);
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
            <p className="section-kicker">PASSWORD RESET</p>
            <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">
              パスワード再発行
            </h1>
            <p className="mt-2 text-xs text-ink-muted">
              ご登録のメールアドレス宛に再発行手続きのご案内をお送りします。
            </p>
          </div>

          {done ? (
            <div className="card p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-ink">
                再発行メールを送信しました
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                {email} 宛にメールをお送りしました。メール内の案内に従ってパスワードを再設定してください。
              </p>
              <div className="mt-6">
                <Link href="/login" className="btn btn-outline">
                  ログイン画面へ戻る
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-8">
              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}
              <label className="mb-5 block">
                <span className="label">ご登録メールアドレス</span>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@acecareer.jp"
                />
              </label>
              <button disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
                {submitting ? "送信中..." : "再発行メールを送信"}
              </button>

              <p className="mt-5 text-center text-xs text-ink-muted">
                <Link href="/login" className="link">
                  ログインに戻る
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
