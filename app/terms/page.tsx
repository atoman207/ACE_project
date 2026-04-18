export const metadata = { title: "利用規約" };

export default function TermsPage() {
  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-12">
          <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
            利用規約
          </h1>
        </div>
      </div>

      <div className="container-x py-12">
        <article className="prose mx-auto max-w-3xl text-sm leading-relaxed text-ink-soft">
          <Section title="第1条（適用）">
            本規約は、ACEキャリア株式会社（以下「当社」）が提供する会員制求人サービス「ACEキャリア」（以下「本サービス」）の利用に関する条件を定めるものです。
          </Section>
          <Section title="第2条（会員登録）">
            会員登録を希望する方は、当社の定める手続に従い登録を申請するものとし、当社が承認した時点で会員となります。
          </Section>
          <Section title="第3条（アカウントの管理）">
            会員は、自己の責任においてID・パスワードを管理するものとし、第三者に譲渡または貸与することはできません。
          </Section>
          <Section title="第4条（禁止事項）">
            会員は、本サービスの利用にあたり、法令違反、虚偽情報の登録、他者へのなりすまし、その他当社が不適切と判断する行為を行ってはならないものとします。
          </Section>
          <Section title="第5条（サービスの変更・停止）">
            当社は、本サービスの内容を随時変更し、または一時的に停止することがあります。
          </Section>
          <Section title="第6条（免責）">
            当社は、本サービスの提供にあたり、会員に生じた損害について、法令に基づく場合を除き責任を負わないものとします。
          </Section>
          <Section title="第7条（退会）">
            会員は、所定の手続に従いいつでも退会することができます。
          </Section>
          <Section title="第8条（準拠法・管轄）">
            本規約の解釈は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
