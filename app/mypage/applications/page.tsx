"use client";

import Link from "next/link";
import MypageLayout from "@/components/MypageLayout";
import { useApp } from "@/lib/store";
import { getJob } from "@/lib/mockJobs";

export default function ApplicationsPage() {
  return (
    <MypageLayout title="応募履歴" description="応募した求人と選考ステータスを確認できます。">
      <AppList />
    </MypageLayout>
  );
}

function AppList() {
  const { applications } = useApp();

  if (applications.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-semibold text-ink">
          まだ応募した求人はありません
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          気になる求人を見つけたら、詳細ページから応募できます。
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
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-alt text-xs text-ink-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">応募日</th>
            <th className="px-4 py-3 text-left font-semibold">会社名</th>
            <th className="px-4 py-3 text-left font-semibold">ポジション</th>
            <th className="px-4 py-3 text-left font-semibold">ステータス</th>
            <th className="px-4 py-3 text-right font-semibold">詳細</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => {
            const job = getJob(a.jobId);
            return (
              <tr key={a.id} className="border-t border-surface-line">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">
                  {new Date(a.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft">
                  {job?.company ?? "-"}
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-ink">
                  {job?.position ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="badge badge-live">{a.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {job && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-xs text-brand hover:underline"
                    >
                      求人を見る →
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
