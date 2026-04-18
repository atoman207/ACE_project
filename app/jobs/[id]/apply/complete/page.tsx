import Link from "next/link";
import { notFound } from "next/navigation";
import { getJob, JOBS } from "@/lib/mockJobs";

export function generateStaticParams() {
  return JOBS.map((j) => ({ id: j.id }));
}

export const metadata = { title: "応募完了" };

export default function ApplyCompletePage({
  params,
}: {
  params: { id: string };
}) {
  const job = getJob(params.id);
  if (!job) notFound();

  return (
    <div className="bg-surface-warm">
      <div className="container-x py-16">
        <div className="mx-auto max-w-xl">
          <div className="card p-8 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">
              ご応募ありがとうございます
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              以下の求人への応募を受け付けました。
            </p>

            <div className="mt-6 rounded-md bg-surface-warm p-5 text-left">
              <p className="text-[11px] text-ink-muted">応募求人</p>
              <p className="mt-1 text-xs text-ink-muted">{job.company}</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">
                {job.position}
              </p>
            </div>

            <div className="mt-8 text-left">
              <p className="text-sm font-semibold text-ink">今後の流れ</p>
              <ol className="mt-3 space-y-2 text-xs text-ink-soft">
                <li>1. 担当アドバイザーより応募内容を確認しご連絡します（1〜2営業日目安）。</li>
                <li>2. 応募条件・ご意向についての事前面談を行います。</li>
                <li>3. 企業へ推薦・選考日程調整を進めます。</li>
              </ol>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <Link
                href="/line"
                className="btn bg-[#06C755] text-white hover:bg-[#05a948]"
              >
                LINE登録をする（おすすめ）
              </Link>
              <Link href="/counseling" className="btn btn-outline">
                キャリア面談を予約する
              </Link>
              <Link href="/jobs" className="btn btn-ghost border border-surface-line">
                他の求人を見る
              </Link>
              <Link href="/mypage/applications" className="text-xs text-ink-muted hover:underline">
                応募履歴を確認する →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
