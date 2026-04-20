"use client";

import Link from "next/link";
import MypageLayout from "@/components/MypageLayout";
import { useApp } from "@/lib/store";
import { useJobs } from "@/lib/use-jobs";

export default function MyPage() {
  return (
    <MypageLayout title="マイページ" description="登録情報・応募状況・気になる求人を一元管理できます。">
      <Dashboard />
    </MypageLayout>
  );
}

function Dashboard() {
  const { savedJobIds, applications, member } = useApp();
  const { jobs, loading } = useJobs();
  const recommended = jobs.filter((j) => j.status === "募集中").slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="気になる求人"
          value={savedJobIds.length}
          href="/mypage/saved"
          action="一覧を見る"
        />
        <StatCard
          label="応募済み"
          value={applications.length}
          href="/mypage/applications"
          action="応募履歴を見る"
        />
        <StatCard
          label="キャリア面談"
          value={"ご予約"}
          href="/counseling"
          action="面談を予約する"
          kind="cta"
        />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">おすすめ求人</h2>
          <Link href="/jobs" className="text-xs text-ink-muted hover:text-brand">
            すべて見る →
          </Link>
        </div>
        <ul className="divide-y divide-surface-line">
          {loading ? (
            <li className="py-6 text-sm text-ink-muted">求人を読み込み中...</li>
          ) : (
            recommended.map((j) => (
            <li key={j.id} className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-xs text-ink-muted">{j.company}</p>
                <Link
                  href={`/jobs/${j.id}`}
                  className="mt-0.5 block text-sm font-semibold text-ink hover:text-brand"
                >
                  {j.position}
                </Link>
                <p className="mt-1 text-xs text-ink-soft">
                  {j.location}・{j.salary}・{j.remote}
                </p>
              </div>
              <Link
                href={`/jobs/${j.id}`}
                className="btn btn-outline whitespace-nowrap !py-2 !px-3 text-xs"
              >
                詳細を見る
              </Link>
            </li>
            ))
          )}
        </ul>
      </div>

      <div className="card overflow-hidden">
        <div className="bg-ink p-6 text-white">
          <p className="text-[11px] font-semibold tracking-widest text-brand-300">
            CAREER COUNSELING
          </p>
          <h3 className="mt-1 text-lg font-semibold">
            現役アクチュアリーに相談してみませんか？
          </h3>
          <p className="mt-2 text-sm text-white/70">
            将来のキャリア設計、転職のタイミング、求人選定まで、専門家の視点で個別にアドバイスいたします。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/counseling" className="btn btn-primary text-sm">
              キャリア面談を予約する
            </Link>
            <Link
              href="/line"
              className="btn bg-[#06C755] text-white hover:bg-[#05a948] text-sm"
            >
              LINEで相談する
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-surface-line bg-surface-warm p-5 text-xs text-ink-muted">
        登録メールアドレス：
        <span className="ml-1 font-semibold text-ink">{member?.email}</span>
        {" / "}
        登録日：
        <span className="ml-1 font-semibold text-ink">
          {new Date(member?.createdAt ?? new Date().toISOString()).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  action,
  kind,
}: {
  label: string;
  value: string | number;
  href: string;
  action: string;
  kind?: "cta";
}) {
  return (
    <div className={`card p-5 ${kind === "cta" ? "bg-brand text-white border-brand" : ""}`}>
      <p className={`text-xs ${kind === "cta" ? "text-white/80" : "text-ink-muted"}`}>
        {label}
      </p>
      <p
        className={`mt-1 font-serif text-3xl font-bold ${
          kind === "cta" ? "text-white" : "text-ink"
        }`}
      >
        {typeof value === "number" ? `${value} 件` : value}
      </p>
      <Link
        href={href}
        className={`mt-3 inline-block text-xs font-semibold hover:underline ${
          kind === "cta" ? "text-white" : "text-brand"
        }`}
      >
        {action} →
      </Link>
    </div>
  );
}
