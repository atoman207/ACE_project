import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="font-serif text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        URLが正しいかご確認ください。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn btn-primary">
          トップへ戻る
        </Link>
        <Link href="/jobs" className="btn btn-outline">
          求人を探す
        </Link>
      </div>
    </div>
  );
}
