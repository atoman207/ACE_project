import Link from "next/link";
import LineAddButton from "./LineAddButton";

export const metadata = { title: "LINE登録のご案内" };

export default function LinePage() {
  return (
    <>
      <section className="border-b border-surface-line bg-gradient-to-br from-white via-surface-warm to-green-50">
        <div className="container-x py-16 text-center">
          <p className="section-kicker">LINE OFFICIAL</p>
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            LINEでACEキャリアとつながる
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            メールよりもスピーディーに新着求人・面談案内・選考対策の情報を受け取れます。
          </p>

          <div className="mx-auto mt-10 max-w-sm rounded-xl border border-surface-line bg-white p-6 shadow-lift">
            <div className="mx-auto mb-5 flex h-40 w-40 items-center justify-center rounded-md border-2 border-dashed border-surface-line bg-surface-warm">
              <p className="text-xs text-ink-muted">QRコード<br />（プレースホルダー）</p>
            </div>
            <LineAddButton />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-14">
          <h2 className="section-title mb-8 text-center">LINE登録のメリット</h2>
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            {[
              {
                t: "連絡がスムーズ",
                d: "メールでは埋もれがちな連絡も、LINEなら確実に届きます。",
              },
              {
                t: "新着求人をタイムリーに",
                d: "ご希望条件に合致する新着求人をスピーディーにご案内できます。",
              },
              {
                t: "面談案内もLINEで",
                d: "キャリア面談の予約・リマインドもLINEで完結できます。",
              },
              {
                t: "気軽な相談にも対応",
                d: "メールほどフォーマルにならず、気軽に相談できる窓口です。",
              },
            ].map((b) => (
              <div key={b.t} className="card p-6">
                <h3 className="mb-2 text-sm font-semibold text-ink">{b.t}</h3>
                <p className="text-xs leading-relaxed text-ink-soft">{b.d}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-md border border-dashed border-surface-line bg-surface-warm p-5 text-xs leading-relaxed text-ink-soft">
            当社からの営業的なメッセージは最小限とし、ご希望に応じた情報のみをお送りします。配信停止もワンクリックで可能です。
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/register" className="btn btn-primary">
              会員登録も済ませる
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
