import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-surface-line bg-surface-warm">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              アクチュアリー・保険数理人材のための、現役アクチュアリーによる専門特化型の会員制転職プラットフォーム。
            </p>
          </div>

          <FooterCol
            title="求人を探す"
            links={[
              { href: "/jobs", label: "求人一覧" },
              { href: "/jobs?kind=生命保険", label: "生命保険の求人" },
              { href: "/jobs?kind=損害保険", label: "損害保険の求人" },
              { href: "/jobs?kind=再保険", label: "再保険の求人" },
              { href: "/jobs?kind=コンサル", label: "コンサルの求人" },
            ]}
          />

          <FooterCol
            title="サービス"
            links={[
              { href: "/register", label: "無料会員登録" },
              { href: "/login", label: "ログイン" },
              { href: "/counseling", label: "キャリア面談について" },
              { href: "/line", label: "LINE登録" },
              { href: "/faq", label: "よくあるご質問" },
            ]}
          />

          <FooterCol
            title="運営・規約"
            links={[
              { href: "/company", label: "運営会社" },
              { href: "/terms", label: "利用規約" },
              { href: "/privacy", label: "プライバシーポリシー" },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-surface-line py-5">
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs text-ink-muted md:flex-row">
          <p>© {year} ACEキャリア. All rights reserved.</p>
          <p>アクチュアリー・保険数理人材のための会員制求人サイト</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-ink">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-xs text-ink-soft hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
