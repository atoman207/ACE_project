import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="ACEキャリア トップへ">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
        <rect x="1" y="1" width="38" height="38" rx="6" fill="#b94047" />
        <path
          d="M11 28 L19 12 L27 28 H24 L19 18 L14 28 Z"
          fill="#ffffff"
        />
        <rect x="18" y="21" width="12" height="2" fill="#ffffff" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold tracking-wide text-ink">
          ACE<span className="text-brand">キャリア</span>
        </span>
        <span className="text-[10px] tracking-[0.18em] text-ink-muted">
          ACTUARY CAREER
        </span>
      </span>
    </Link>
  );
}
