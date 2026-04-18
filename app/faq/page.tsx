export const metadata = { title: "よくあるご質問" };

const GROUPS = [
  {
    group: "サービスについて",
    items: [
      {
        q: "ACEキャリアとはどのようなサービスですか？",
        a: "アクチュアリー・保険数理人材に特化した会員制の転職支援プラットフォームです。現役アクチュアリーがキャリアアドバイザーを務めます。",
      },
      {
        q: "利用料金はかかりますか？",
        a: "会員登録・キャリア面談・求人紹介・選考対策まで、求職者の皆さまは完全に無料でご利用いただけます。",
      },
      {
        q: "アクチュアリー以外でも登録できますか？",
        a: "主要な対象はアクチュアリー志望・アクチュアリー関連領域の方ですが、類似する保険数理人材の方にもご利用いただけます。",
      },
    ],
  },
  {
    group: "会員登録について",
    items: [
      {
        q: "会員登録には何分くらいかかりますか？",
        a: "目安3〜5分で完了します。入力項目はメールアドレス・基本情報・キャリア情報等です。",
      },
      {
        q: "研究会員でも登録できますか？",
        a: "はい、研究会員・準会員・正会員いずれの方もご登録可能です。若手向けの求人もご紹介可能です。",
      },
      {
        q: "現職の勤務先に知られませんか？",
        a: "ご本人の同意なく第三者（応募先・現職）に情報を開示することはありません。",
      },
    ],
  },
  {
    group: "求人・応募について",
    items: [
      {
        q: "非公開求人はありますか？",
        a: "非公開求人を多数取り扱っています。会員登録後、キャリア面談等を通じて個別にご紹介します。",
      },
      {
        q: "応募後、必ず面接に進まなければいけませんか？",
        a: "いいえ。応募後でもご意向変更はいつでも可能です。無理な応募勧奨は行いません。",
      },
      {
        q: "書類の添削や面接対策は受けられますか？",
        a: "現役アクチュアリー経験者による書類・面接対策をご提供しています。",
      },
    ],
  },
  {
    group: "キャリア面談について",
    items: [
      {
        q: "面談は対面ですか、オンラインですか？",
        a: "オンライン・対面いずれも対応可能です。ご希望の形式をお伝えください。",
      },
      {
        q: "転職予定がなくても面談できますか？",
        a: "はい、情報収集段階でも歓迎しております。無理な転職勧奨はいたしません。",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-12">
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            よくあるご質問
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            ACEキャリアに関してよくいただくご質問をまとめました。
          </p>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mx-auto max-w-3xl space-y-10">
          {GROUPS.map((g) => (
            <section key={g.group}>
              <h2 className="mb-4 border-l-[3px] border-brand pl-3 text-lg font-semibold text-ink">
                {g.group}
              </h2>
              <div className="divide-y divide-surface-line overflow-hidden rounded-lg border border-surface-line">
                {g.items.map((item) => (
                  <details
                    key={item.q}
                    className="group p-5 open:bg-surface-alt"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-ink">
                        Q. {item.q}
                      </span>
                      <span className="text-brand transition-transform group-open:rotate-45">
                        ＋
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      A. {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
