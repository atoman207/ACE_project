"use client";

import { useCallback, useEffect, useState } from "react";

type JobRow = {
  id: string;
  company: string;
  company_kind: string;
  position: string;
  summary: string;
  location: string;
  salary: string;
  salary_min: number;
  salary_max: number;
  employment_type: string;
  remote: string;
  tags: string[] | null;
  status: string;
  posted_at: string;
  description: string;
  requirements: string[] | null;
  preferred: string[] | null;
  company_overview: string;
  work_hours: string;
  benefits: string[] | null;
  holidays: string;
  selection_process: string[] | null;
  ideal_candidate: string;
  is_confidential: boolean;
  published: boolean;
  sort_order: number;
};

type JobDraft = {
  company: string;
  companyKind: string;
  position: string;
  summary: string;
  location: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  employmentType: string;
  remote: string;
  tagsCsv: string;
  status: string;
  description: string;
  requirementsCsv: string;
  preferredCsv: string;
  companyOverview: string;
  workHours: string;
  benefitsCsv: string;
  holidays: string;
  selectionProcessCsv: string;
  idealCandidate: string;
  isConfidential: boolean;
  published: boolean;
  sortOrder: number;
};

const COMPANY_KINDS = ["生命保険", "損害保険", "再保険", "コンサル", "信託銀行", "年金", "その他"];
const STATUSES = ["募集中", "募集終了"];
const REMOTES = ["フルリモート可", "一部リモート可", "出社"];
const EMPLOYMENT = ["正社員", "契約社員", "業務委託"];

function rowToDraft(r: JobRow): JobDraft {
  return {
    company: r.company ?? "",
    companyKind: r.company_kind ?? "その他",
    position: r.position ?? "",
    summary: r.summary ?? "",
    location: r.location ?? "",
    salary: r.salary ?? "",
    salaryMin: r.salary_min ?? 0,
    salaryMax: r.salary_max ?? 0,
    employmentType: r.employment_type ?? "正社員",
    remote: r.remote ?? "出社",
    tagsCsv: (r.tags ?? []).join(", "),
    status: r.status ?? "募集中",
    description: r.description ?? "",
    requirementsCsv: (r.requirements ?? []).join("\n"),
    preferredCsv: (r.preferred ?? []).join("\n"),
    companyOverview: r.company_overview ?? "",
    workHours: r.work_hours ?? "",
    benefitsCsv: (r.benefits ?? []).join("\n"),
    holidays: r.holidays ?? "",
    selectionProcessCsv: (r.selection_process ?? []).join("\n"),
    idealCandidate: r.ideal_candidate ?? "",
    isConfidential: Boolean(r.is_confidential),
    published: r.published !== false,
    sortOrder: r.sort_order ?? 0,
  };
}

const EMPTY_DRAFT: JobDraft = {
  company: "",
  companyKind: "その他",
  position: "",
  summary: "",
  location: "",
  salary: "",
  salaryMin: 500,
  salaryMax: 1000,
  employmentType: "正社員",
  remote: "出社",
  tagsCsv: "",
  status: "募集中",
  description: "",
  requirementsCsv: "",
  preferredCsv: "",
  companyOverview: "",
  workHours: "",
  benefitsCsv: "",
  holidays: "",
  selectionProcessCsv: "",
  idealCandidate: "",
  isConfidential: false,
  published: true,
  sortOrder: 0,
};

function splitLines(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function splitCsv(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function draftToApiBody(d: JobDraft) {
  return {
    company: d.company,
    companyKind: d.companyKind,
    position: d.position,
    summary: d.summary,
    location: d.location,
    salary: d.salary,
    salaryMin: Number(d.salaryMin) || 0,
    salaryMax: Number(d.salaryMax) || 0,
    employmentType: d.employmentType,
    remote: d.remote,
    tags: splitCsv(d.tagsCsv),
    status: d.status,
    description: d.description,
    requirements: splitLines(d.requirementsCsv),
    preferred: splitLines(d.preferredCsv),
    companyOverview: d.companyOverview,
    workHours: d.workHours,
    benefits: splitLines(d.benefitsCsv),
    holidays: d.holidays,
    selectionProcess: splitLines(d.selectionProcessCsv),
    idealCandidate: d.idealCandidate,
    isConfidential: d.isConfidential,
    published: d.published,
    sortOrder: Number(d.sortOrder) || 0,
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<JobDraft>(EMPTY_DRAFT);
  const [showAdd, setShowAdd] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/admin/jobs${qs}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setJobs(data.jobs ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込み失敗");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(id: string | null) {
    setError(null);
    try {
      const url = id ? `/api/admin/jobs/${id}` : "/api/admin/jobs";
      const method = id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToApiBody(draft)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setEditingId(null);
      setShowAdd(false);
      setDraft(EMPTY_DRAFT);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失敗");
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`「${label}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除失敗");
    }
  }

  async function togglePublished(row: JobRow) {
    try {
      const res = await fetch(`/api/admin/jobs/${row.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !row.published }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "切替失敗");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-serif text-xl font-bold text-ink">求人管理</h2>
        <div className="flex flex-wrap gap-2">
          <input
            className="input !py-2 !text-sm"
            placeholder="企業名で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary !py-2 !px-4 text-sm"
            onClick={() => {
              setDraft(EMPTY_DRAFT);
              setShowAdd((v) => !v);
              setEditingId(null);
            }}
          >
            {showAdd ? "閉じる" : "+ 求人追加"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>
      )}

      {(showAdd || editingId) && (
        <JobEditor
          draft={draft}
          setDraft={setDraft}
          onSave={() => save(editingId)}
          onCancel={() => {
            setEditingId(null);
            setShowAdd(false);
            setDraft(EMPTY_DRAFT);
          }}
          title={editingId ? "求人を編集" : "新しい求人を追加"}
        />
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-ink-muted">読み込み中...</div>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-sm text-ink-muted">求人がありません。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-line bg-surface-alt text-xs text-ink-muted">
                <tr>
                  <th className="px-3 py-3 text-left">並び順</th>
                  <th className="px-3 py-3 text-left">企業</th>
                  <th className="px-3 py-3 text-left">ポジション</th>
                  <th className="px-3 py-3 text-left">カテゴリ</th>
                  <th className="px-3 py-3 text-left">状態</th>
                  <th className="px-3 py-3 text-left">公開</th>
                  <th className="px-3 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} className="border-b border-surface-line last:border-b-0">
                    <td className="px-3 py-3 text-xs text-ink-muted">{j.sort_order}</td>
                    <td className="px-3 py-3 text-ink">{j.company}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{j.position}</p>
                      <p className="text-[11px] text-ink-muted">{j.location}</p>
                    </td>
                    <td className="px-3 py-3 text-xs">{j.company_kind}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className={`rounded px-2 py-0.5 ${j.status === "募集中" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => togglePublished(j)}
                        className={`rounded px-2 py-0.5 text-xs ${j.published ? "bg-brand/10 text-brand" : "bg-gray-100 text-gray-500"}`}
                      >
                        {j.published ? "公開中" : "非公開"}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn btn-outline !py-1 !px-2 text-xs"
                          onClick={() => {
                            setEditingId(j.id);
                            setShowAdd(false);
                            setDraft(rowToDraft(j));
                          }}
                        >
                          編集
                        </button>
                        <button
                          className="btn btn-ghost !py-1 !px-2 text-xs text-red-600 hover:bg-red-50"
                          onClick={() => remove(j.id, `${j.company} / ${j.position}`)}
                        >
                          削除
                        </button>
                      </div>
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

function JobEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
  title,
}: {
  draft: JobDraft;
  setDraft: (d: JobDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  title: string;
}) {
  function upd<K extends keyof JobDraft>(k: K, v: JobDraft[K]) {
    setDraft({ ...draft, [k]: v });
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="card mb-6 p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <L label="会社名 *">
          <input className="input" value={draft.company} onChange={(e) => upd("company", e.target.value)} />
        </L>
        <L label="ポジション *">
          <input className="input" value={draft.position} onChange={(e) => upd("position", e.target.value)} />
        </L>
        <L label="カテゴリ (company_kind)">
          <select className="input" value={draft.companyKind} onChange={(e) => upd("companyKind", e.target.value)}>
            {COMPANY_KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </L>
        <L label="状態 (募集中/終了)">
          <select className="input" value={draft.status} onChange={(e) => upd("status", e.target.value)}>
            {STATUSES.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </L>
        <L label="雇用形態">
          <select className="input" value={draft.employmentType} onChange={(e) => upd("employmentType", e.target.value)}>
            {EMPLOYMENT.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </L>
        <L label="リモート">
          <select className="input" value={draft.remote} onChange={(e) => upd("remote", e.target.value)}>
            {REMOTES.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </L>
        <L label="勤務地">
          <input className="input" value={draft.location} onChange={(e) => upd("location", e.target.value)} />
        </L>
        <L label="給与（表示文字列）">
          <input className="input" value={draft.salary} onChange={(e) => upd("salary", e.target.value)} />
        </L>
        <L label="給与下限（万円）">
          <input type="number" className="input" value={draft.salaryMin} onChange={(e) => upd("salaryMin", Number(e.target.value))} />
        </L>
        <L label="給与上限（万円）">
          <input type="number" className="input" value={draft.salaryMax} onChange={(e) => upd("salaryMax", Number(e.target.value))} />
        </L>
        <L label="勤務時間">
          <input className="input" value={draft.workHours} onChange={(e) => upd("workHours", e.target.value)} />
        </L>
        <L label="休日休暇">
          <input className="input" value={draft.holidays} onChange={(e) => upd("holidays", e.target.value)} />
        </L>
        <L label="タグ（カンマ区切り）">
          <input className="input" value={draft.tagsCsv} onChange={(e) => upd("tagsCsv", e.target.value)} />
        </L>
        <L label="並び順（小さい順で表示）">
          <input type="number" className="input" value={draft.sortOrder} onChange={(e) => upd("sortOrder", Number(e.target.value))} />
        </L>
      </div>

      <L label="サマリ" className="mt-4">
        <input className="input" value={draft.summary} onChange={(e) => upd("summary", e.target.value)} />
      </L>
      <L label="業務内容" className="mt-4">
        <textarea className="input min-h-[100px]" value={draft.description} onChange={(e) => upd("description", e.target.value)} />
      </L>
      <L label="会社概要" className="mt-4">
        <textarea className="input min-h-[80px]" value={draft.companyOverview} onChange={(e) => upd("companyOverview", e.target.value)} />
      </L>
      <L label="理想像" className="mt-4">
        <textarea className="input min-h-[60px]" value={draft.idealCandidate} onChange={(e) => upd("idealCandidate", e.target.value)} />
      </L>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <L label="応募要件（1行1件）">
          <textarea className="input min-h-[100px]" value={draft.requirementsCsv} onChange={(e) => upd("requirementsCsv", e.target.value)} />
        </L>
        <L label="歓迎要件（1行1件）">
          <textarea className="input min-h-[100px]" value={draft.preferredCsv} onChange={(e) => upd("preferredCsv", e.target.value)} />
        </L>
        <L label="福利厚生（1行1件）">
          <textarea className="input min-h-[100px]" value={draft.benefitsCsv} onChange={(e) => upd("benefitsCsv", e.target.value)} />
        </L>
        <L label="選考フロー（1行1件）">
          <textarea className="input min-h-[100px]" value={draft.selectionProcessCsv} onChange={(e) => upd("selectionProcessCsv", e.target.value)} />
        </L>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={draft.published} onChange={(e) => upd("published", e.target.checked)} />
          公開する
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={draft.isConfidential} onChange={(e) => upd("isConfidential", e.target.checked)} />
          非公開求人（会社名マスク）
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="btn btn-primary !py-2 !px-5 text-sm">保存</button>
        <button type="button" className="btn btn-ghost !py-2 !px-5 text-sm" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}

function L({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
