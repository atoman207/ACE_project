"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import type { Job } from "@/lib/types";
import JobCard from "@/components/JobCard";

export default function JobDetailClient({
  job,
  similar,
}: {
  job: Job;
  similar: Job[];
}) {
  const { isSaved, toggleSaved, member } = useApp();
  const saved = isSaved(job.id);

  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-10">
          <nav className="mb-3 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand">
              ホーム
            </Link>
            <span className="divider-dot" />
            <Link href="/jobs" className="hover:text-brand">
              求人一覧
            </Link>
            <span className="divider-dot" />
            <span>{job.position}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="badge badge-tag">{job.companyKind}</span>
                {job.status === "募集中" ? (
                  <span className="badge badge-live">● 募集中</span>
                ) : (
                  <span className="badge badge-closed">募集終了</span>
                )}
                {job.isConfidential && (
                  <span className="badge badge-tag">非公開求人</span>
                )}
              </div>
              <p className="text-sm text-ink-soft">{job.company}</p>
              <h1 className="mt-1 font-serif text-2xl font-bold leading-tight text-ink md:text-3xl">
                {job.position}
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleSaved(job.id)}
                className={`btn text-sm ${
                  saved ? "btn-outline" : "btn-ghost border border-surface-line"
                }`}
              >
                <span className={saved ? "text-brand" : ""}>♥</span>
                {saved ? "保存済み" : "気になるに保存"}
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("URLをコピーしました");
                  }
                }}
                className="btn btn-ghost border border-surface-line text-sm"
              >
                共有
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div>
            {/* Summary bar */}
            <dl className="card grid grid-cols-2 gap-4 p-5 md:grid-cols-3">
              <Summary label="勤務地" value={job.location} />
              <Summary label="想定年収" value={job.salary} highlight />
              <Summary label="雇用形態" value={job.employmentType} />
              <Summary label="勤務時間" value={job.workHours} />
              <Summary label="リモート" value={job.remote} />
              <Summary label="掲載日" value={job.postedAt} />
            </dl>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <span key={t} className="badge badge-tag">
                  #{t}
                </span>
              ))}
            </div>

            <Section title="仕事内容">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {job.description}
              </p>
            </Section>

            <Section title="応募要件">
              <BulletList items={job.requirements} />
            </Section>

            <Section title="歓迎要件">
              <BulletList items={job.preferred} />
            </Section>

            <Section title="会社概要">
              <p className="text-sm leading-relaxed text-ink-soft">
                {job.companyOverview}
              </p>
            </Section>

            <Section title="勤務地">
              <p className="text-sm text-ink-soft">{job.location}</p>
            </Section>

            <Section title="勤務時間">
              <p className="text-sm text-ink-soft">{job.workHours}</p>
            </Section>

            <Section title="給与">
              <p className="text-sm font-semibold text-brand">{job.salary}</p>
              <p className="mt-1 text-xs text-ink-muted">
                経験・スキル・年齢等を考慮のうえ決定します。
              </p>
            </Section>

            <Section title="福利厚生">
              <BulletList items={job.benefits} />
            </Section>

            <Section title="休日休暇">
              <p className="text-sm text-ink-soft">{job.holidays}</p>
            </Section>

            <Section title="選考プロセス">
              <ol className="space-y-2 text-sm">
                {job.selectionProcess.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-center gap-3 rounded-md border border-surface-line bg-white px-4 py-2.5"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-semibold text-brand">
                      {i + 1}
                    </span>
                    <span className="text-ink-soft">{s}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="この求人に向いている人">
              <p className="rounded-md bg-surface-warm p-4 text-sm leading-relaxed text-ink-soft">
                {job.idealCandidate}
              </p>
            </Section>

            {/* Non-login guard note */}
            {!member && (
              <div className="mt-10 rounded-lg border border-brand-200 bg-brand-50/60 p-6">
                <p className="text-sm font-semibold text-ink">
                  この求人に応募するには会員登録が必要です
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  ログインまたは会員登録（無料）で、応募・保存・キャリア面談のご予約が可能になります。
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/register" className="btn btn-primary text-sm">
                    無料会員登録
                  </Link>
                  <Link href="/login" className="btn btn-outline text-sm">
                    ログイン
                  </Link>
                </div>
              </div>
            )}

            {/* Similar jobs */}
            {similar.length > 0 && (
              <div className="mt-14">
                <h2 className="section-title mb-5">類似する求人</h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {similar.map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12">
              <h2 className="section-title mb-5">この求人についてよくある質問</h2>
              <div className="divide-y divide-surface-line overflow-hidden rounded-lg border border-surface-line">
                {[
                  {
                    q: "現職に在籍したまま応募できますか？",
                    a: "もちろん可能です。選考スケジュールや現職との調整についても、担当アドバイザーがサポートします。",
                  },
                  {
                    q: "アクチュアリー研究会員でも応募できますか？",
                    a: "求人により要件が異なりますが、研究会員から応募可能な求人も多数あります。詳細は面談でご案内します。",
                  },
                  {
                    q: "書類の添削や面接対策は受けられますか？",
                    a: "現役アクチュアリー経験者による書類添削・面接対策をご提供しています。",
                  },
                ].map((q) => (
                  <details key={q.q} className="group p-5 open:bg-surface-alt">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-ink">Q. {q.q}</span>
                      <span className="text-brand transition-transform group-open:rotate-45">
                        ＋
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      A. {q.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar CTA */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card overflow-hidden">
              <div className="bg-ink p-5 text-white">
                <p className="text-[11px] font-semibold tracking-widest text-brand-300">
                  APPLY
                </p>
                <p className="mt-1 text-sm font-semibold">この求人に応募する</p>
                <p className="mt-2 text-xs text-white/70">
                  応募後、担当アドバイザーよりご連絡いたします。選考日程の調整も当社が代行します。
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {job.status === "募集中" ? (
                  <Link
                    href={`/jobs/${job.id}/apply`}
                    className="btn btn-primary"
                  >
                    この求人に応募する
                  </Link>
                ) : (
                  <button className="btn cursor-not-allowed bg-surface-alt text-ink-muted" disabled>
                    募集は終了しました
                  </button>
                )}
                <Link href="/counseling" className="btn btn-outline text-sm">
                  キャリア面談を予約する
                </Link>
                <Link href="/line" className="btn bg-[#06C755] text-white hover:bg-[#05a948] text-sm">
                  LINEで相談する
                </Link>
                <button
                  onClick={() => toggleSaved(job.id)}
                  className="btn btn-ghost border border-surface-line text-sm"
                >
                  {saved ? "♥ 保存済み" : "♡ 気になるに保存"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-surface-line bg-surface-warm p-4 text-xs leading-relaxed text-ink-soft">
              非公開求人や似た条件の求人も多数保有しています。キャリア面談で個別にご紹介可能です。
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 border-l-[3px] border-brand pl-3 text-base font-semibold text-ink md:text-lg">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-ink-soft">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Summary({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] text-ink-muted">{label}</dt>
      <dd className={`mt-0.5 text-sm ${highlight ? "font-semibold text-brand" : "text-ink"}`}>
        {value}
      </dd>
    </div>
  );
}
