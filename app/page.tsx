import Link from "next/link";
import { JOBS, POPULAR_TAGS } from "@/lib/mockJobs";
import JobCard from "@/components/JobCard";
import HomeSearch from "@/components/HomeSearch";

export default function HomePage() {
  const recommended = JOBS.filter((j) => j.status === "募集中").slice(0, 6);

  return (
    <>
      {/* Section 1: Hero */}
      <section className="relative overflow-hidden border-b border-surface-line bg-gradient-to-br from-white via-surface-warm to-brand-50/40">
        <div className="container-x grid items-center gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <p className="section-kicker">ACTUARY CAREER PLATFORM</p>
            <h1 className="font-serif text-[28px] font-bold leading-[1.3] text-ink md:text-[44px] md:leading-[1.25]">
              アクチュアリーの転職なら、
              <span className="text-brand">ACEキャリア</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">
              現役アクチュアリーが支援する、会員制転職プラットフォーム。
              <br className="hidden md:inline" />
              専門職だからこそ、求人の質・選考対策・将来設計まで妥協しない転職を。
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">
                無料会員登録
              </Link>
              <Link href="/jobs" className="btn btn-outline">
                求人を探す
              </Link>
              <Link href="/counseling" className="btn btn-ghost border border-surface-line">
                まずはキャリア面談を相談する
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-surface-line pt-6">
              <Stat value="100%" label="アクチュアリー経験者率" />
              <Stat value="100件+" label="紹介可能求人数" />
              <Stat value="あり" label="非公開求人" />
            </dl>
          </div>

          <div className="md:col-span-5">
            <HeroMock />
          </div>
        </div>
      </section>

      {/* Section 2: Search shortcuts */}
      <section className="border-b border-surface-line bg-white">
        <div className="container-x py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="section-kicker">JOB SEARCH</p>
              <h2 className="section-title">求人を条件から探す</h2>
            </div>
            <Link href="/jobs" className="hidden text-sm text-ink-soft hover:text-brand md:inline">
              すべての求人を見る →
            </Link>
          </div>
          <HomeSearch />

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold text-ink-muted">人気検索タグ</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((t) => (
                <Link
                  key={t}
                  href={`/jobs?q=${encodeURIComponent(t)}`}
                  className="badge badge-tag hover:border-brand hover:text-brand"
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Member benefits */}
      <section className="bg-surface-warm" id="member-benefits">
        <div className="container-x py-16">
          <div className="mb-10 text-center">
            <p className="section-kicker">MEMBERSHIP</p>
            <h2 className="section-title">会員登録でできること</h2>
            <p className="mt-3 text-sm text-ink-soft">
              ACEキャリアは会員制のプラットフォームです。登録すると以下の価値をご利用いただけます。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <BenefitCard
              icon={<IconDoc />}
              title="会員限定求人の閲覧"
              desc="非公開求人を含む、アクチュアリー特化求人の全文閲覧が可能になります。"
            />
            <BenefitCard
              icon={<IconHeart />}
              title="気になる求人の保存"
              desc="比較検討したい求人をいつでも見返せるように保存できます。"
            />
            <BenefitCard
              icon={<IconList />}
              title="応募履歴の管理"
              desc="応募状況をマイページから一元的に確認できます。"
            />
            <BenefitCard
              icon={<IconChat />}
              title="面談 / LINEでの継続相談"
              desc="キャリア面談やLINEで現役アクチュアリーに継続相談ができます。"
            />
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="btn btn-primary">
              無料で会員登録する
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Why ACE Career */}
      <section className="border-b border-surface-line bg-white" id="features">
        <div className="container-x py-16">
          <div className="mb-10">
            <p className="section-kicker">WHY ACE CAREER</p>
            <h2 className="section-title">ACEキャリアが選ばれる理由</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ReasonCard
              no="01"
              title="現役アクチュアリーによる支援"
              desc="キャリアアドバイザーの100%がアクチュアリー経験者。数理実務と選考プロセスの双方を熟知した立場から、書類・面接・キャリア選択を支援します。"
            />
            <ReasonCard
              no="02"
              title="専門特化求人の豊富さ"
              desc="生保・損保・再保険・コンサル・年金まで、アクチュアリー領域の求人を100件以上。非公開求人も多数保有しています。"
            />
            <ReasonCard
              no="03"
              title="独自の選考対策"
              desc="アクチュアリー特有の技術面接、ケース面接、英語面接などに対応した実務者視点の選考対策を提供します。"
            />
            <ReasonCard
              no="04"
              title="無理な転職勧奨をしない姿勢"
              desc="「今は転職すべきではない」という結論もきちんとお伝えします。長期キャリアの伴走者としての立ち位置を重視しています。"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Featured jobs */}
      <section className="bg-white">
        <div className="container-x py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">FEATURED JOBS</p>
              <h2 className="section-title">おすすめ求人・新着求人</h2>
            </div>
            <Link href="/jobs" className="text-sm text-ink-soft hover:text-brand">
              求人一覧を見る →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/jobs" className="btn btn-outline">
              すべての求人を見る
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Flow */}
      <section className="bg-surface-warm">
        <div className="container-x py-16">
          <div className="mb-10 text-center">
            <p className="section-kicker">CAREER FLOW</p>
            <h2 className="section-title">キャリア支援の流れ</h2>
          </div>

          <ol className="grid gap-3 md:grid-cols-6">
            {[
              { n: "01", t: "会員登録" },
              { n: "02", t: "キャリア面談" },
              { n: "03", t: "求人紹介" },
              { n: "04", t: "選考対策" },
              { n: "05", t: "面接" },
              { n: "06", t: "内定" },
            ].map((s) => (
              <li
                key={s.n}
                className="card flex flex-col items-center p-5 text-center"
              >
                <span className="text-[11px] font-semibold tracking-widest text-brand">
                  STEP {s.n}
                </span>
                <span className="mt-2 text-sm font-semibold text-ink">{s.t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 7: Operator trust */}
      <section className="border-b border-surface-line bg-white">
        <div className="container-x py-16">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-brand-50 to-surface-warm p-1">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-brand-50 text-5xl font-serif text-brand">
                      A
                    </div>
                    <p className="text-sm font-semibold text-ink">代表アクチュアリー</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      アクチュアリー正会員 / FIAJ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="section-kicker">TRUST</p>
              <h2 className="section-title">現役アクチュアリーが運営する、信頼の転職支援</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">
                ACEキャリアは、実際にアクチュアリーとして保険業界で実務経験を積んだメンバーが運営しています。
                表面的なキーワードマッチングではなく、アクチュアリー業務・組織・評価制度を理解した上でのマッチングと選考支援を行います。
              </p>

              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                <TrustItem text="日本アクチュアリー会 正会員（FIAJ）による運営" />
                <TrustItem text="生損保・再保険・コンサルでの実務経験" />
                <TrustItem text="若手〜正会員層まで幅広い支援実績" />
                <TrustItem text="無理な転職勧奨は行わない方針" />
              </ul>

              <div className="mt-7">
                <Link href="/company" className="link text-sm">
                  運営会社情報を見る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: FAQ excerpt */}
      <section className="bg-white">
        <div className="container-x py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="section-kicker">FAQ</p>
              <h2 className="section-title">よくあるご質問</h2>
            </div>
            <Link href="/faq" className="text-sm text-ink-soft hover:text-brand">
              すべて見る →
            </Link>
          </div>

          <div className="divide-y divide-surface-line overflow-hidden rounded-lg border border-surface-line">
            {FAQS.map((q) => (
              <details key={q.q} className="group p-5 open:bg-surface-alt">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-ink">Q. {q.q}</span>
                  <span className="text-brand transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">A. {q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="bg-ink text-white">
        <div className="container-x py-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            NEXT STEP
          </p>
          <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
            まずは求人閲覧・キャリア相談の第一歩を
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            会員登録は無料です。求人の閲覧と比較、気になる保存、応募履歴の管理、面談予約まで、すべてワンストップで行えます。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn btn-primary !px-7 !py-3.5">
              無料会員登録
            </Link>
            <Link
              href="/counseling"
              className="btn border border-white/40 text-white hover:bg-white/10"
            >
              キャリア面談について見る
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

const FAQS = [
  {
    q: "会員登録は無料ですか？",
    a: "はい、ACEキャリアは会員登録から転職支援まで完全に無料でご利用いただけます。求職者からの費用をいただくことはありません。",
  },
  {
    q: "アクチュアリー試験の研究会員でも利用できますか？",
    a: "ご利用いただけます。研究会員・準会員・正会員いずれの方にも、それぞれのキャリアフェーズに応じた求人・アドバイスを提供しています。",
  },
  {
    q: "現職の勤務先に知られず利用できますか？",
    a: "プライバシーには細心の注意を払って運営しています。応募先企業への情報開示は事前にご本人の確認を得た上でのみ行います。",
  },
  {
    q: "必ず転職しなくてはいけませんか？",
    a: "いいえ。ACEキャリアは無理な転職勧奨を行いません。現職に残る選択が最善と判断した場合は、その旨を率直にお伝えします。",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-serif text-2xl font-bold text-ink md:text-3xl">{value}</dt>
      <dd className="mt-1 text-[11px] text-ink-muted md:text-xs">{label}</dd>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand">
        {icon}
      </div>
      <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
      <p className="text-xs leading-relaxed text-ink-soft">{desc}</p>
    </div>
  );
}

function ReasonCard({
  no,
  title,
  desc,
}: {
  no: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 rounded-lg border border-surface-line p-6">
      <span className="font-serif text-3xl font-bold text-brand">{no}</span>
      <div>
        <h3 className="mb-2 text-base font-semibold text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{desc}</p>
      </div>
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-ink-soft">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b94047" strokeWidth="2.5" className="mt-[2px] shrink-0">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </li>
  );
}

function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -right-3 -top-3 hidden h-24 w-24 rounded-full bg-brand/10 blur-2xl md:block" />
      <div className="relative rounded-xl border border-surface-line bg-white shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-surface-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-brand/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-surface-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-surface-line" />
          <span className="ml-3 text-[11px] text-ink-muted">acecareer.jp / jobs</span>
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="badge badge-live">● 募集中</span>
            <span className="badge badge-tag">生命保険</span>
          </div>
          <p className="text-xs text-ink-muted">大手生命保険会社A</p>
          <h4 className="mt-1 text-base font-semibold text-ink">
            商品開発アクチュアリー（第一分野）
          </h4>
          <div className="mt-4 space-y-2 text-[11px] text-ink-soft">
            <Row label="勤務地" value="東京都千代田区" />
            <Row label="想定年収" value="700万〜1,400万円" valueClass="text-brand font-semibold" />
            <Row label="雇用形態" value="正社員" />
            <Row label="リモート" value="一部リモート可" />
          </div>
          <div className="mt-4 flex gap-2">
            <span className="badge badge-tag">#正会員歓迎</span>
            <span className="badge badge-tag">#商品開発</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-surface-line px-5 py-3 text-xs">
          <span className="text-ink-muted">◇ 気になるに保存</span>
          <span className="font-semibold text-brand">求人詳細を見る →</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-surface-line pb-1.5 last:border-0">
      <span className="text-ink-muted">{label}</span>
      <span className={valueClass ?? "text-ink"}>{value}</span>
    </div>
  );
}

function IconDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="15" y2="13" />
      <line x1="8" y1="17" x2="15" y2="17" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
