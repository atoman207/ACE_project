import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentMember();
  if (!me) redirect("/login");
  if (!me.isAdmin) redirect("/mypage");

  return (
    <div className="bg-surface-warm min-h-screen">
      <div className="border-b border-surface-line bg-white">
        <div className="container-x flex items-center justify-between py-4">
          <div>
            <p className="section-kicker">ADMIN</p>
            <h1 className="font-serif text-lg font-bold text-ink">管理者ダッシュボード</h1>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/admin/users" className="text-ink-soft hover:text-brand">
              ユーザー管理
            </Link>
            <Link href="/admin/jobs" className="text-ink-soft hover:text-brand">
              求人管理
            </Link>
            <Link href="/admin/applications" className="text-ink-soft hover:text-brand">
              応募者管理
            </Link>
            <Link href="/admin/newsletter" className="text-ink-soft hover:text-brand">
              メルマガ
            </Link>
          </nav>
        </div>
      </div>
      <div className="container-x py-8">{children}</div>
    </div>
  );
}
