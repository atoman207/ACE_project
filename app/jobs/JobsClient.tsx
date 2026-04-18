"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import JobCard from "@/components/JobCard";
import { JOBS, JOB_KINDS } from "@/lib/mockJobs";
import type { Job } from "@/lib/types";

type Filter = {
  kind: string;
  location: string;
  salary: string;
  remote: string;
  employment: string;
  company: string;
  q: string;
  onlyOpen: boolean;
};

function toFilter(p: URLSearchParams): Filter {
  return {
    kind: p.get("kind") ?? "",
    location: p.get("location") ?? "",
    salary: p.get("salary") ?? "",
    remote: p.get("remote") ?? "",
    employment: p.get("employment") ?? "",
    company: p.get("company") ?? "",
    q: p.get("q") ?? "",
    onlyOpen: p.get("onlyOpen") === "1",
  };
}

function applyFilter(jobs: Job[], f: Filter): Job[] {
  return jobs.filter((j) => {
    if (f.kind && j.companyKind !== f.kind) return false;
    if (f.location && !j.location.includes(f.location)) return false;
    if (f.salary && j.salaryMin < Number(f.salary)) return false;
    if (f.remote && j.remote !== f.remote) return false;
    if (f.employment && j.employmentType !== f.employment) return false;
    if (f.company && !j.company.toLowerCase().includes(f.company.toLowerCase())) return false;
    if (f.onlyOpen && j.status !== "募集中") return false;
    if (f.q) {
      const haystack = [j.position, j.company, j.summary, j.description, ...j.tags]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(f.q.toLowerCase())) return false;
    }
    return true;
  });
}

export default function JobsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = toFilter(new URLSearchParams(params.toString()));
  const [filter, setFilter] = useState<Filter>(initial);
  const [sort, setSort] = useState<"new" | "salary" | "recommend">("new");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const arr = applyFilter(JOBS, filter);
    if (sort === "salary") {
      return [...arr].sort((a, b) => b.salaryMax - a.salaryMax);
    }
    if (sort === "new") {
      return [...arr].sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
    }
    return arr;
  }, [filter, sort]);

  function submit() {
    const p = new URLSearchParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v === true) p.set(k, "1");
      else if (typeof v === "string" && v) p.set(k, v);
    });
    router.push(`/jobs?${p.toString()}`);
    setMobileFilterOpen(false);
  }

  function reset() {
    const blank: Filter = {
      kind: "",
      location: "",
      salary: "",
      remote: "",
      employment: "",
      company: "",
      q: "",
      onlyOpen: false,
    };
    setFilter(blank);
    router.push(`/jobs`);
  }

  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-10">
          <nav className="mb-3 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand">
              ホーム
            </Link>
            <span className="divider-dot" />
            求人一覧
          </nav>
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            アクチュアリー求人一覧
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            生保・損保・再保険・コンサル・年金までアクチュアリー特化求人を掲載中。
          </p>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filter sidebar */}
          <aside className="hidden lg:block">
            <FilterPanel
              filter={filter}
              setFilter={setFilter}
              submit={submit}
              reset={reset}
            />
            <PromoBox />
          </aside>

          {/* Mobile filter button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-outline w-full"
            >
              絞り込み条件を開く
            </button>
          </div>

          {/* Results */}
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-surface-line pb-4">
              <p className="text-sm text-ink-soft">
                該当 <span className="font-bold text-ink">{filtered.length}</span> 件
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted">並び替え</span>
                <select
                  className="input !w-auto !py-1.5 !text-xs"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                >
                  <option value="new">新着順</option>
                  <option value="salary">年収順</option>
                  <option value="recommend">おすすめ順</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card p-10 text-center">
                <p className="mb-3 text-sm font-semibold text-ink">
                  該当する求人が見つかりませんでした
                </p>
                <p className="mb-5 text-xs text-ink-muted">
                  条件を変えて再度お試しください。非公開求人を含むご紹介はキャリア面談で個別にご案内できます。
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button onClick={reset} className="btn btn-outline">
                    条件をリセット
                  </button>
                  <Link href="/counseling" className="btn btn-primary">
                    キャリア面談を予約する
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {filtered.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </div>
            )}

            <div className="mt-10 rounded-lg border border-dashed border-brand-200 bg-brand-50/50 p-5 text-center">
              <p className="text-sm font-semibold text-ink">
                検索結果に表示されない「非公開求人」も多数保有しています
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                会員登録またはキャリア面談で個別にご紹介しています。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/register" className="btn btn-primary !py-2 !px-4 text-xs">
                  無料会員登録
                </Link>
                <Link href="/counseling" className="btn btn-outline !py-2 !px-4 text-xs">
                  面談を予約する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto h-full w-[90%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">絞り込み</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-ink-muted"
              >
                ✕
              </button>
            </div>
            <FilterPanel
              filter={filter}
              setFilter={setFilter}
              submit={submit}
              reset={reset}
            />
          </div>
        </div>
      )}
    </>
  );
}

function FilterPanel({
  filter,
  setFilter,
  submit,
  reset,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  submit: () => void;
  reset: () => void;
}) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-ink">絞り込み条件</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
      >
        <FilterField label="職種・業界">
          <select
            className="input"
            value={filter.kind}
            onChange={(e) => setFilter({ ...filter, kind: e.target.value })}
          >
            <option value="">すべて</option>
            {JOB_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label="勤務地">
          <select
            className="input"
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="東京">東京</option>
            <option value="大阪">大阪</option>
            <option value="その他">その他</option>
          </select>
        </FilterField>

        <FilterField label="年収レンジ（下限）">
          <select
            className="input"
            value={filter.salary}
            onChange={(e) => setFilter({ ...filter, salary: e.target.value })}
          >
            <option value="">指定なし</option>
            <option value="600">600万円〜</option>
            <option value="800">800万円〜</option>
            <option value="1000">1,000万円〜</option>
            <option value="1200">1,200万円〜</option>
          </select>
        </FilterField>

        <FilterField label="リモート可否">
          <select
            className="input"
            value={filter.remote}
            onChange={(e) => setFilter({ ...filter, remote: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="フルリモート可">フルリモート可</option>
            <option value="一部リモート可">一部リモート可</option>
            <option value="出社">出社</option>
          </select>
        </FilterField>

        <FilterField label="雇用形態">
          <select
            className="input"
            value={filter.employment}
            onChange={(e) => setFilter({ ...filter, employment: e.target.value })}
          >
            <option value="">すべて</option>
            <option value="正社員">正社員</option>
            <option value="契約社員">契約社員</option>
            <option value="業務委託">業務委託</option>
          </select>
        </FilterField>

        <FilterField label="企業名で検索">
          <input
            className="input"
            value={filter.company}
            onChange={(e) => setFilter({ ...filter, company: e.target.value })}
            placeholder="企業名"
          />
        </FilterField>

        <FilterField label="フリーワード">
          <input
            className="input"
            value={filter.q}
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
            placeholder="スキル・業務内容など"
          />
        </FilterField>

        <label className="flex items-center gap-2 text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={filter.onlyOpen}
            onChange={(e) =>
              setFilter({ ...filter, onlyOpen: e.target.checked })
            }
          />
          募集中のみ表示
        </label>

        <div className="flex flex-col gap-2 pt-2">
          <button type="submit" className="btn btn-primary">
            この条件で検索
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-ink-muted hover:underline"
          >
            条件をリセット
          </button>
        </div>
      </form>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function PromoBox() {
  return (
    <div className="mt-5 card overflow-hidden">
      <div className="bg-ink p-5 text-white">
        <p className="text-xs font-semibold tracking-widest text-brand-300">
          MEMBERSHIP
        </p>
        <p className="mt-2 text-sm font-semibold leading-snug">
          会員登録で<br />
          非公開求人を含む全求人を閲覧
        </p>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Link href="/register" className="btn btn-primary text-xs">
          無料会員登録
        </Link>
        <Link href="/counseling" className="btn btn-outline text-xs">
          キャリア面談を予約
        </Link>
        <Link href="/line" className="btn text-xs bg-[#06C755] text-white hover:bg-[#05a948]">
          LINEで相談
        </Link>
      </div>
    </div>
  );
}
