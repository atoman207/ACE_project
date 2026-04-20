"use client";

import Link from "next/link";
import type { Job } from "@/lib/types";
import { useApp } from "@/lib/store";

export default function JobCard({ job }: { job: Job }) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(job.id);

  return (
    <article className="card card-lift group relative flex flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-surface-line p-6">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand">
              {job.companyKind}
            </span>
            <span className="h-3 w-px bg-surface-line" />
            {job.status === "募集中" ? (
              <span className="badge badge-live">募集中</span>
            ) : (
              <span className="badge badge-closed">募集終了</span>
            )}
            {job.isConfidential && (
              <span className="badge badge-tag">非公開求人</span>
            )}
          </div>
          <p className="truncate text-[12px] text-ink-muted">{job.company}</p>
          <h3 className="mt-1 font-serif text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
            {job.position}
          </h3>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaved(job.id);
          }}
          aria-label={saved ? "気になるから外す" : "気になるに保存"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-line bg-white text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={saved ? "text-brand" : ""}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-5 text-[13px] leading-[1.8] text-ink-soft">{job.summary}</p>

        <dl className="mb-5 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-surface-line pt-4 text-xs">
          <Info label="勤務地" value={job.location} />
          <Info label="想定年収" value={job.salary} highlight />
          <Info label="雇用形態" value={job.employmentType} />
          <Info label="リモート" value={job.remote} />
        </dl>

        {job.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {job.tags.slice(0, 4).map((t) => (
              <span key={t} className="badge badge-tag">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-surface-line pt-4">
          <span className="text-[10px] uppercase tracking-wider text-ink-faint">
            {job.postedAt}
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="text-[12px] font-semibold tracking-wide text-brand transition-all hover:text-brand-700"
          >
            求人詳細を見る →
          </Link>
        </div>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="col-span-1 min-w-0">
      <dt className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
      <dd
        className={`mt-0.5 truncate text-[12.5px] ${
          highlight ? "font-serif font-bold text-brand" : "text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
