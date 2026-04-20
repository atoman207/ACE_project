"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

type Row = {
  id: string;
  applied_at: string;
  status: string;
  intent: string;
  reason: string;
  current_situation: string;
  wants_counseling: boolean;
  free_text: string;
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    years: number;
    current_company: string;
    qualification: string;
  } | null;
  jobs: {
    id: string;
    company: string;
    position: string;
  } | null;
};

const STATUSES = ["受付済", "確認中", "書類通過", "面接中", "終了"] as const;

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/applications", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setRows(data.applications ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込み失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新失敗");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-ink">応募者管理</h2>
        <button className="btn btn-ghost !py-2 !px-3 text-sm" onClick={load}>
          再読み込み
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-ink-muted">読み込み中...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-ink-muted">応募はまだありません。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-line bg-surface-alt text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-3 text-left">応募日時</th>
                  <th className="px-3 py-3 text-left">応募者</th>
                  <th className="px-3 py-3 text-left">求人</th>
                  <th className="px-3 py-3 text-left">ステータス</th>
                  <th className="px-3 py-3 text-left">面談希望</th>
                  <th className="px-3 py-3 text-right">詳細</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const open = expanded === r.id;
                  return (
                    <Fragment key={r.id}>
                      <tr className="border-b border-surface-line">
                        <td className="whitespace-nowrap px-3 py-3 text-xs text-ink-muted">
                          {new Date(r.applied_at).toLocaleString("ja-JP")}
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium text-ink">{r.users?.name ?? "(削除済ユーザー)"}</p>
                          <p className="text-[11px] text-ink-muted">{r.users?.email ?? ""}</p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="text-xs text-ink-muted">{r.jobs?.company ?? "-"}</p>
                          <p className="text-sm font-medium text-ink">{r.jobs?.position ?? "(削除済求人)"}</p>
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className="input !py-1 !text-xs"
                            value={r.status}
                            onChange={(e) => updateStatus(r.id, e.target.value)}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3 text-xs">
                          {r.wants_counseling ? (
                            <span className="rounded bg-brand/10 px-2 py-0.5 text-brand">希望</span>
                          ) : (
                            <span className="text-ink-muted">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            className="text-xs text-brand hover:underline"
                            onClick={() => setExpanded(open ? null : r.id)}
                          >
                            {open ? "閉じる" : "詳細"}
                          </button>
                        </td>
                      </tr>
                      {open && (
                        <tr className="border-b border-surface-line bg-surface-warm">
                          <td colSpan={6} className="px-4 py-4">
                            <dl className="grid gap-3 text-xs md:grid-cols-2">
                              <D label="電話">{r.users?.phone || "-"}</D>
                              <D label="年齢 / 年次">
                                {(r.users?.age || "-") + " 歳 / " + (r.users?.years || "-") + " 年次"}
                              </D>
                              <D label="現在の勤務先">{r.users?.current_company || "-"}</D>
                              <D label="資格">{r.users?.qualification || "-"}</D>
                              <D label="転職意向">{r.intent || "-"}</D>
                              <D label="現在の状況">{r.current_situation || "-"}</D>
                              <D label="応募理由" span>
                                {r.reason || "（未入力）"}
                              </D>
                              <D label="自由記述" span>
                                {r.free_text || "（未入力）"}
                              </D>
                            </dl>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function D({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <dt className="text-[11px] font-semibold text-ink-muted">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-ink">{children}</dd>
    </div>
  );
}
