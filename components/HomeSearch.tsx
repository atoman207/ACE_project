"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { JOB_KINDS } from "@/lib/mockJobs";

export default function HomeSearch() {
  const router = useRouter();
  const [kind, setKind] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [remote, setRemote] = useState("");
  const [company, setCompany] = useState("");
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (kind) params.set("kind", kind);
    if (location) params.set("location", location);
    if (salary) params.set("salary", salary);
    if (remote) params.set("remote", remote);
    if (company) params.set("company", company);
    if (q) params.set("q", q);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border border-surface-line bg-white p-5 shadow-card"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="職種・業界">
          <select className="input" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">すべて</option>
            {JOB_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>

        <Field label="勤務地">
          <select
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">すべて</option>
            <option value="東京">東京</option>
            <option value="大阪">大阪</option>
            <option value="その他">その他</option>
          </select>
        </Field>

        <Field label="想定年収（下限）">
          <select className="input" value={salary} onChange={(e) => setSalary(e.target.value)}>
            <option value="">こだわらない</option>
            <option value="600">600万円〜</option>
            <option value="800">800万円〜</option>
            <option value="1000">1,000万円〜</option>
            <option value="1200">1,200万円〜</option>
          </select>
        </Field>

        <Field label="リモート可否">
          <select className="input" value={remote} onChange={(e) => setRemote(e.target.value)}>
            <option value="">すべて</option>
            <option value="フルリモート可">フルリモート可</option>
            <option value="一部リモート可">一部リモート可</option>
            <option value="出社">出社</option>
          </select>
        </Field>

        <Field label="企業名">
          <input
            className="input"
            placeholder="例：生命保険、コンサル など"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Field>

        <Field label="フリーワード">
          <input
            className="input"
            placeholder="例：商品開発、ERM、英語"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-5 flex flex-col-reverse items-center gap-3 md:flex-row md:justify-end">
        <button
          type="button"
          onClick={() => {
            setKind("");
            setLocation("");
            setSalary("");
            setRemote("");
            setCompany("");
            setQ("");
          }}
          className="text-xs text-ink-muted hover:underline"
        >
          条件をリセット
        </button>
        <button type="submit" className="btn btn-primary w-full md:w-auto md:px-10">
          この条件で検索する
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
