export const metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-12">
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            プライバシーポリシー
          </h1>
        </div>
      </div>

      <div className="container-x py-12">
        <article className="prose mx-auto max-w-3xl text-sm leading-relaxed text-ink-soft">
          <Section title="1. 個人情報の取得">
            当社は、適法かつ公正な手段により、本サービスの提供に必要な範囲で個人情報を取得します。
          </Section>
          <Section title="2. 利用目的">
            取得した個人情報は、会員管理、求人紹介、キャリア相談、選考支援、各種ご連絡等の目的のために利用します。
          </Section>
          <Section title="3. 第三者への提供">
            応募先企業への情報提供は、事前にご本人の同意を得た場合にのみ行います。法令に基づく場合を除き、第三者に情報を提供することはありません。
          </Section>
          <Section title="4. 安全管理">
            個人情報の漏洩、滅失、毀損等を防止するために、適切な安全管理措置を講じます。
          </Section>
          <Section title="5. 開示等の請求">
            ご本人から個人情報の開示、訂正、利用停止等のご請求があった場合、法令に基づき適切に対応します。
          </Section>
          <Section title="6. お問い合わせ窓口">
            個人情報に関するお問い合わせは、サイト内のお問い合わせ窓口までご連絡ください。
          </Section>
          <Section title="7. 改定">
            本ポリシーは必要に応じて改定することがあります。重要な変更は本サイト上で告知します。
          </Section>
          <p className="mt-10 text-xs text-ink-muted">
            制定日：2024年1月1日 / 最終改定日：2026年4月1日
          </p>
        </article>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-base font-semibold text-ink">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
