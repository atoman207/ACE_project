"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    // Demo: accept any credentials
    login({
      id: `m-${Date.now()}`,
      name: email.split("@")[0],
      email,
      phone: "",
      age: 0,
      years: 0,
      currentCompany: "",
      qualification: "未取得",
      otherQualifications: "",
      createdAt: new Date().toISOString(),
    });
    router.push("/mypage");
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

            <button className="btn btn-primary w-full">ログイン</button>

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
