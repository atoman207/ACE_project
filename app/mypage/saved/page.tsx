"use client";

import Link from "next/link";
import MypageLayout from "@/components/MypageLayout";
import { useApp } from "@/lib/store";
import { JOBS } from "@/lib/mockJobs";

export default function SavedPage() {
  return (
    <MypageLayout title="気になる求人" description="保存した求人の一覧です。">
      <SavedList />
    </MypageLayout>
  );
}

function SavedList() {
  const { savedJobIds, toggleSaved } = useApp();
  const saved = JOBS.filter((j) => savedJobIds.includes(j.id));

  if (saved.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-semibold text-ink">
          保存した求人はまだありません
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          気になる求人を見つけたら、詳細ページの保存アイコンから追加できます。
        </p>
        <div className="mt-6">
          <Link href="/jobs" className="btn btn-primary">
            求人一覧を見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {saved.map((job) => (
        <div key={job.id} className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="badge badge-tag">{job.companyKind}</span>
              {job.status === "募集中" ? (
                <span className="badge badge-live">● 募集中</span>
              ) : (
                <span className="badge badge-closed">募集終了</span>
              )}
            </div>
            <p className="text-xs text-ink-muted">{job.company}</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">
              {job.position}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {job.location} / {job.salary} / {job.remote}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/jobs/${job.id}`}
              className="btn btn-outline !py-2 !px-4 text-xs"
            >
              詳細を見る
            </Link>
            {job.status === "募集中" && (
              <Link
                href={`/jobs/${job.id}/apply`}
                className="btn btn-primary !py-2 !px-4 text-xs"
              >
                応募する
              </Link>
            )}
            <button
              onClick={() => toggleSaved(job.id)}
              className="btn btn-ghost border border-surface-line !py-2 !px-3 text-xs"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
