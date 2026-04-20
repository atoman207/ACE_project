"use client";

import { useCallback, useEffect, useState } from "react";

type Sub = {
  id: string;
  email: string;
  name: string;
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

export default function AdminNewsletterPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setSubs(data.subscribers ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込み失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function send() {
    setError(null);
    setResult(null);
    if (!subject.trim() || !html.trim()) {
      setError("件名と本文は必須です。");
      return;
    }
    if (!confirm(`購読者 ${subs.filter((s) => !s.unsubscribed_at).length} 名に配信します。よろしいですか？`)) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setResult(`配信完了: 成功 ${data.sent} / 失敗 ${data.failed} / 合計 ${data.total}`);
      setSubject("");
      setHtml("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "配信失敗");
    } finally {
      setSending(false);
    }
  }

  const active = subs.filter((s) => !s.unsubscribed_at);

  return (
    <div>
      <h2 className="mb-6 font-serif text-xl font-bold text-ink">メルマガ配信</h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>
      )}
      {result && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-700">{result}</div>
      )}

      <div className="card mb-6 p-6">
        <h3 className="mb-4 text-sm font-semibold text-ink">新規配信</h3>
        <label className="mb-4 block">
          <span className="label">件名</span>
          <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="mb-4 block">
          <span className="label">本文 (HTML可)</span>
          <textarea
            className="input min-h-[260px] font-mono text-xs"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder={"<p>ACEキャリアをご利用いただきありがとうございます。</p>\n<p>今月の注目求人...</p>"}
          />
        </label>
        <p className="mb-4 text-xs text-ink-muted">
          配信対象: 購読中 {active.length} 名 / 合計 {subs.length} 名
        </p>
        <button disabled={sending} className="btn btn-primary !py-2 !px-5 text-sm disabled:opacity-60" onClick={send}>
          {sending ? "配信中..." : "全購読者に配信"}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-surface-line px-4 py-3 text-sm font-semibold text-ink">購読者一覧</div>
        {loading ? (
          <div className="p-6 text-sm text-ink-muted">読み込み中...</div>
        ) : subs.length === 0 ? (
          <div className="p-6 text-sm text-ink-muted">購読者がいません。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-line bg-surface-alt text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-3 text-left">メール</th>
                  <th className="px-3 py-3 text-left">氏名</th>
                  <th className="px-3 py-3 text-left">登録日</th>
                  <th className="px-3 py-3 text-left">状態</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-b border-surface-line last:border-b-0">
                    <td className="px-3 py-3 text-ink">{s.email}</td>
                    <td className="px-3 py-3 text-ink-soft">{s.name || "-"}</td>
                    <td className="px-3 py-3 text-xs text-ink-muted">
                      {new Date(s.subscribed_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {s.unsubscribed_at ? (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-500">解除済</span>
                      ) : (
                        <span className="rounded bg-brand/10 px-2 py-0.5 text-brand">購読中</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
