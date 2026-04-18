import Link from "next/link";

export const metadata = { title: "会員登録完了" };

export default function RegisterCompletePage() {
  return (
    <div className="bg-surface-warm">
      <div className="container-x py-16">
        <div className="mx-auto max-w-xl">
          <div className="card p-8 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-ink">
              会員登録が完了しました
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              ACEキャリアへようこそ。マイページから求人の閲覧・保存・応募・面談予約が行えます。
            </p>

            <div className="mt-8 flex flex-col gap-2">
              <Link href="/jobs" className="btn btn-primary">
                求人一覧を見る
              </Link>
              <Link href="/mypage" className="btn btn-outline">
                マイページへ
              </Link>
              <Link href="/line" className="btn bg-[#06C755] text-white hover:bg-[#05a948]">
                LINEでもやりとりする
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-dashed border-surface-line p-5 text-xs leading-relaxed text-ink-muted">
            <p className="mb-2 font-semibold text-ink">次のおすすめステップ</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>プロフィール情報を充実させる（マイページ → 登録情報を編集）</li>
              <li>現役アクチュアリーによるキャリア面談を予約する</li>
              <li>LINE登録で新着求人・面談案内をスムーズに受け取る</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
