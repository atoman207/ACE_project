export const metadata = { title: "運営会社" };

export default function CompanyPage() {
  const rows = [
    { k: "会社名", v: "ACEキャリア株式会社" },
    { k: "代表者", v: "代表取締役（アクチュアリー正会員 / FIAJ）" },
    { k: "所在地", v: "東京都千代田区（詳細はお問い合わせください）" },
    { k: "設立", v: "2021年" },
    { k: "事業内容", v: "アクチュアリー・保険数理人材向けの転職支援・キャリアコンサルティング" },
    { k: "許認可", v: "有料職業紹介事業許可（番号は審査・取得後に掲載）" },
    { k: "お問い合わせ", v: "サイト内の会員登録またはLINEからご連絡ください" },
  ];

  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-12">
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            運営会社
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            ACEキャリアは、現役アクチュアリーが運営する会員制転職プラットフォームです。
          </p>
        </div>
      </div>

      <div className="container-x py-12">
        <div className="mx-auto max-w-3xl">
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.k} className="border-b border-surface-line last:border-0">
                    <th className="w-[160px] bg-surface-warm px-5 py-4 text-left text-xs font-semibold text-ink-muted">
                      {r.k}
                    </th>
                    <td className="px-5 py-4 text-ink-soft">{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-md border border-dashed border-surface-line p-5 text-xs leading-relaxed text-ink-muted">
            ※ 本サイトに掲載されている会社情報はデモ用の内容を含みます。実際のサービス提供にあたっては、正式な法人情報・許認可番号を記載します。
          </div>
        </div>
      </div>
    </>
  );
}
