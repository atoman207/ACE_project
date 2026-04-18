"use client";

import Link from "next/link";
import type { Job } from "@/lib/types";
import { useApp } from "@/lib/store";

export default function JobCard({ job }: { job: Job }) {
  const { isSaved, toggleSaved } = useApp();
  const saved = isSaved(job.id);

  return (
    <article className="card group flex flex-col transition-shadow hover:shadow-lift">
      <div className="flex items-start justify-between gap-4 border-b border-surface-line p-5">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="badge badge-tag">{job.companyKind}</span>
            {job.status === "募集中" ? (
              <span className="badge badge-live">● 募集中</span>
            ) : (
              <span className="badge badge-closed">募集終了</span>
            )}
            {job.isConfidential && <span className="badge badge-tag">非公開求人</span>}
          </div>
          <p className="truncate text-sm text-ink-muted">{job.company}</p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-ink group-hover:text-brand">
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
            width="18"
            height="18"
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

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-4 text-sm leading-relaxed text-ink-soft">{job.summary}</p>

        <dl className="mb-4 grid grid-cols-2 gap-y-2 text-xs">
          <Info label="勤務地" value={job.location} />
          <Info label="想定年収" value={job.salary} highlight />
          <Info label="雇用形態" value={job.employmentType} />
          <Info label="リモート" value={job.remote} />
        </dl>

        <div className="mb-5 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((t) => (
            <span key={t} className="badge badge-tag">
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] text-ink-faint">掲載日 {job.postedAt}</span>
          <Link
            href={`/jobs/${job.id}`}
            className="btn btn-outline !py-2 !px-4 text-xs"
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
    <div className="col-span-1">
      <dt className="text-[11px] text-ink-muted">{label}</dt>
      <dd className={`truncate text-xs ${highlight ? "font-semibold text-brand" : "text-ink"}`}>
        {value}
      </dd>
    </div>
  );
}
