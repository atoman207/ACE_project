import Link from "next/link";
import Image from "next/image";
import { getAllJobs, getJobKinds, getPopularTags } from "@/lib/jobs-data";
import JobCard from "@/components/JobCard";
import HomeSearch from "@/components/HomeSearch";
import AnimatedNumber from "@/components/AnimatedNumber";
import heroBg1 from "@/assets/images/bg1.png";
import heroBg2 from "@/assets/images/bg2.jpg";

/** Jobs are loaded from Supabase at request time (no build-time prerender against DB). */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [jobs, popularTags, jobKinds] = await Promise.all([
    getAllJobs(),
    getPopularTags(),
    getJobKinds(),
  ]);
  const recommended = jobs.filter((j) => j.status === "募集中").slice(0, 6);

  return (
    <>
      {/* Section 1: Hero */}
      <section className="relative isolate overflow-hidden border-b border-surface-line">
        <div className="absolute inset-0">
          <Image
            src={heroBg1}
            alt=""
            fill
            priority
            className="hero-bg-image hero-bg-image-a object-cover"
          />
          <Image
            src={heroBg2}
            alt=""
            fill
            priority
            className="hero-bg-image hero-bg-image-b object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/85 via-[#0a0a0c]/70 to-[#0a0a0c]/30" />
        </div>

        <div className="container-x relative z-10 grid min-h-[calc(100vh-4rem)] items-center py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">
              <span className="mr-3 inline-block h-px w-10 bg-brand-400" />
              Actuary Career Platform
            </p>

            <h1 className="font-serif text-[30px] font-bold leading-[1.3] text-white [text-shadow:0_3px_14px_rgba(0,0,0,0.55)] md:text-[48px] md:leading-[1.2]">
              専門性の転職を、
              <br className="hidden md:inline" />
              アクチュアリーと共に。
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-[1.9] text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.45)] md:text-base">
              現役アクチュアリーが支援する、会員制転職プラットフォーム。
              <br className="hidden md:inline" />
              求人の質・選考対策・将来設計まで、妥協のないキャリア支援を。
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/register" className="btn btn-primary !px-7 !py-3.5">
                無料会員登録
              </Link>
              <Link
                href="/jobs"
                className="btn !border !border-white/40 !bg-transparent !px-6 !py-3.5 !text-white hover:!border-white hover:!bg-white/5"
              >
                求人を探す →
              </Link>
              <Link
                href="/counseling"
                className="text-[13px] font-semibold text-white/80 underline-offset-8 hover:text-white hover:underline"
              >
                まずはキャリア面談を相談する
              </Link>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-0 border-t border-white/20 pt-8">
              <Stat value={<AnimatedNumber end={100} suffix="%" durationMs={1900} />} label="アドバイザー アクチュアリー経験者率" light />
              <Stat value={<AnimatedNumber end={100} suffix="件+" durationMs={2100} delayMs={180} />} label="紹介可能求人数" light />
              <Stat value="あり" label="非公開求人" light />
            </dl>
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
          <HomeSearch jobKinds={jobKinds} />

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold text-ink-muted">人気検索タグ</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((t) => (
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

          <div className="border-t border-surface-line">
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] border border-surface-line bg-surface-warm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-brand/30 font-serif text-[44px] text-brand">
                      A
                    </div>
                    <div className="mx-auto mb-4 h-px w-10 bg-brand/40" />
                    <p className="font-serif text-[15px] font-bold text-ink">代表アクチュアリー</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                      Fellow of IAJ
                    </p>
                  </div>
                </div>
                <div className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
                  ACE / Founder
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

function Stat({ value, label, light = false }: { value: React.ReactNode; label: string; light?: boolean }) {
  return (
    <div
      className={`px-4 first:pl-0 last:pr-0 ${
        light ? "border-white/20" : "border-surface-line"
      } [&:not(:last-child)]:border-r`}
    >
      <dt
        className={`font-serif text-[28px] font-bold tabular-nums leading-none md:text-[34px] ${
          light ? "text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]" : "text-ink"
        }`}
      >
        {value}
      </dt>
      <dd className={`mt-2 text-[11px] leading-snug tracking-wide md:text-xs ${light ? "text-white/75" : "text-ink-muted"}`}>
        {label}
      </dd>
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
    <div className="card card-lift group p-7">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand/25 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 font-serif text-[15px] font-bold text-ink">{title}</h3>
      <p className="text-[12.5px] leading-[1.8] text-ink-soft">{desc}</p>
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
    <div className="group flex gap-6 border-b border-surface-line py-7 last:border-b-0 md:gap-7 md:py-8">
      <div className="shrink-0">
        <span className="serif-numeral block">{no}</span>
        <span className="mt-2 block h-px w-10 bg-brand/50 transition-all duration-300 group-hover:w-14 group-hover:bg-brand" />
      </div>
      <div>
        <h3 className="mb-3 font-serif text-[17px] font-bold leading-snug text-ink md:text-[19px]">{title}</h3>
        <p className="text-[13.5px] leading-[1.9] text-ink-soft">{desc}</p>
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
