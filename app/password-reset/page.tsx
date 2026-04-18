"use client";

import Link from "next/link";
import { useState } from "react";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
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
              <button className="btn btn-primary w-full">再発行メールを送信</button>

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
