import Link from "next/link";

export const metadata = { title: "キャリア面談について" };

export default function CounselingPage() {
  return (
    <>
      <section className="border-b border-surface-line bg-gradient-to-br from-white via-surface-warm to-brand-50/40">
        <div className="container-x py-16 text-center">
          <p className="section-kicker">CAREER COUNSELING</p>
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            キャリア面談について
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            現役アクチュアリーが、あなたの現状・ご志向・キャリア戦略を丁寧にヒアリングし、
            <br className="hidden md:inline" />
            求人紹介の有無に関わらず、キャリアについて率直にディスカッションします。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link href="#apply" className="btn btn-primary">
              面談を申し込む
            </Link>
            <Link
              href="/line"
              className="btn bg-[#06C755] text-white hover:bg-[#05a948]"
            >
              LINEで相談する
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-14">
          <h2 className="section-title mb-8 text-center">面談で得られること</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                t: "現状整理と将来設計",
                d: "現職の強み・弱み、将来のキャリア選択肢を数理人材特有の観点から整理します。",
              },
              {
                t: "市場観の共有",
                d: "生保・損保・再保険・コンサル・年金など各領域の求人動向・年収相場をお伝えします。",
              },
              {
                t: "非公開求人のご提案",
                d: "Webに掲載されていない非公開求人を、ご希望に合わせて個別にご紹介します。",
              },
              {
                t: "選考対策",
                d: "書類添削、技術面接、ケース面接、英語面接まで、実務者視点で対応します。",
              },
              {
                t: "資格取得の戦略",
                d: "準会員・正会員・年金数理人など、キャリアと連動した資格戦略も相談できます。",
              },
              {
                t: "転職しない判断も尊重",
                d: "現職に残るのが最善と判断した場合はその旨を率直にお伝えします。",
              },
            ].map((b) => (
              <div key={b.t} className="card p-6">
                <h3 className="mb-2 text-sm font-semibold text-ink">{b.t}</h3>
                <p className="text-xs leading-relaxed text-ink-soft">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-warm">
        <div className="container-x py-14">
          <h2 className="section-title mb-8 text-center">こんな方におすすめ</h2>
          <ul className="mx-auto grid max-w-3xl gap-3 md:grid-cols-2">
            {[
              "将来のキャリアに漠然とした不安がある方",
              "現職と他社のキャリアを比較検討したい方",
              "正会員取得後のキャリアパスを考えたい方",
              "生損保・再保険・コンサルの違いを知りたい方",
              "英語環境・外資系への転職を考えている方",
              "今すぐではないが情報収集したい方",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 rounded-md bg-white p-4 text-sm text-ink-soft">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b94047" strokeWidth="2.5" className="mt-[2px] shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-x py-14">
          <h2 className="section-title mb-8 text-center">面談の流れ</h2>
          <ol className="mx-auto grid max-w-5xl gap-3 md:grid-cols-5">
            {[
              { n: "01", t: "お申し込み", d: "会員登録またはLINEからご連絡" },
              { n: "02", t: "日程調整", d: "ご希望日時を伺います" },
              { n: "03", t: "事前ヒアリング", d: "簡単な事前情報を頂戴します" },
              { n: "04", t: "面談実施", d: "オンライン・対面どちらも対応" },
              { n: "05", t: "継続サポート", d: "求人紹介・選考対策・継続相談" },
            ].map((s) => (
              <li key={s.n} className="card p-5 text-center">
                <p className="text-[11px] font-semibold tracking-widest text-brand">
                  STEP {s.n}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink">{s.t}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="apply" className="bg-ink text-white">
        <div className="container-x py-14 text-center">
          <h2 className="font-serif text-3xl font-bold">
            キャリア面談は無料です
          </h2>
          <p className="mt-3 text-sm text-white/70">
            求人紹介の有無に関わらずお気軽にご相談ください。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link href="/register" className="btn btn-primary">
              会員登録して面談を予約する
            </Link>
            <Link
              href="/line"
              className="btn bg-[#06C755] text-white hover:bg-[#05a948]"
            >
              LINEで相談する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
