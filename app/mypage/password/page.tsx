"use client";

import { useState } from "react";
import MypageLayout from "@/components/MypageLayout";

export default function PasswordChangePage() {
  return (
    <MypageLayout title="パスワード変更" description="ログインに使用するパスワードを変更できます。">
      <PasswordForm />
    </MypageLayout>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!current || !next || !confirm) {
      setError("すべての項目を入力してください。");
      return;
    }
    if (next !== confirm) {
      setError("新しいパスワードが一致しません。");
      return;
    }
    setDone(true);
    setCurrent("");
    setNext("");
    setConfirm("");
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <form onSubmit={submit} className="card p-6 md:p-8">
      {done && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-700">
          パスワードを変更しました。
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}
      <label className="mb-4 block">
        <span className="label">現在のパスワード</span>
        <input
          type="password"
          className="input"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
      </label>
      <label className="mb-4 block">
        <span className="label">新しいパスワード</span>
        <input
          type="password"
          className="input"
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />
      </label>
      <label className="mb-6 block">
        <span className="label">新しいパスワード（確認）</span>
        <input
          type="password"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      <button className="btn btn-primary w-full md:w-auto md:px-10">
        変更を保存
      </button>
    </form>
  );
}
