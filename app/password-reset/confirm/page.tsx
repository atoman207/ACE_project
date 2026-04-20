"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function PasswordResetConfirmPage() {
  return (
    <Suspense fallback={<div className="container-x py-16 text-sm text-ink-muted">読み込み中...</div>}>
      <ResetConfirm />
    </Suspense>
  );
}

function ResetConfirm() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search?.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください。");
      return;
    }
    if (password !== confirm) {
      setError("パスワードが一致しません。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "更新に失敗しました。");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 1500);
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
            <p className="section-kicker">NEW PASSWORD</p>
            <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">新しいパスワードを設定</h1>
          </div>

          {!token ? (
            <div className="card p-8 text-center text-sm text-ink-muted">
              無効なリンクです。
              <div className="mt-4">
                <Link href="/password-reset" className="link text-xs">
                  再発行をやり直す
                </Link>
              </div>
            </div>
          ) : done ? (
            <div className="card p-8 text-center">
              <p className="text-sm font-semibold text-ink">パスワードを更新しました</p>
              <p className="mt-2 text-xs text-ink-muted">ログイン画面に移動します...</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-8">
              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}
              <label className="mb-4 block">
                <span className="label">新しいパスワード</span>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6文字以上"
                />
              </label>
              <label className="mb-5 block">
                <span className="label">パスワード確認</span>
                <input
                  type="password"
                  className="input"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </label>
              <button disabled={submitting} className="btn btn-primary w-full disabled:opacity-60">
                {submitting ? "更新中..." : "パスワードを更新"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
