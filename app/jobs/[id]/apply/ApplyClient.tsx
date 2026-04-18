"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useApp } from "@/lib/store";
import type { Job } from "@/lib/types";

export default function ApplyClient({ job }: { job: Job }) {
  return (
    <AuthGuard>
      <Inner job={job} />
    </AuthGuard>
  );
}

function Inner({ job }: { job: Job }) {
  const router = useRouter();
  const { member, addApplication } = useApp();

  const [step, setStep] = useState<"form" | "confirm">("form");
  const [form, setForm] = useState({
    intent: "積極的に検討中",
    reason: "",
    currentSituation: "在職中（現職に勤務）",
    wantsCounseling: true,
    freeText: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = `a-${Date.now()}`;
    addApplication({
      id,
      jobId: job.id,
      appliedAt: new Date().toISOString(),
      status: "受付済",
      intent: form.intent,
      reason: form.reason,
      currentSituation: form.currentSituation,
      wantsCounseling: form.wantsCounseling,
      freeText: form.freeText,
    });
    router.push(`/jobs/${job.id}/apply/complete`);
  }

  return (
    <>
      <div className="border-b border-surface-line bg-surface-warm">
        <div className="container-x py-10">
          <nav className="mb-3 text-xs text-ink-muted">
            <Link href="/" className="hover:text-brand">
              ホーム
            </Link>
            <span className="divider-dot" />
            <Link href="/jobs" className="hover:text-brand">
              求人一覧
            </Link>
            <span className="divider-dot" />
            <Link href={`/jobs/${job.id}`} className="hover:text-brand">
              {job.position}
            </Link>
            <span className="divider-dot" />
            応募
          </nav>
          <h1 className="font-serif text-3xl font-bold text-ink">応募フォーム</h1>
          <p className="mt-1 text-sm text-ink-soft">
            必要事項をご入力の上、送信してください。送信後、担当者からご連絡いたします。
          </p>
        </div>
      </div>

      <div className="container-x py-10">
        <div className="mx-auto max-w-3xl">
          {/* Target job */}
          <div className="card mb-5 p-5">
            <p className="text-xs font-semibold text-brand">応募する求人</p>
            <p className="mt-1 text-xs text-ink-muted">{job.company}</p>
            <p className="mt-0.5 text-base font-semibold text-ink">{job.position}</p>
            <p className="mt-1 text-xs text-ink-soft">
              {job.location} / {job.salary}
            </p>
          </div>

          {step === "form" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("confirm");
              }}
              className="card p-6 md:p-8"
            >
              <Group title="応募者基本情報（会員情報から自動反映）">
                <div className="grid gap-3 rounded-md bg-surface-warm p-4 text-xs md:grid-cols-2">
                  <Info label="氏名" value={member?.name ?? "-"} />
                  <Info label="メール" value={member?.email ?? "-"} />
                  <Info label="電話番号" value={member?.phone || "未登録"} />
                  <Info label="年齢" value={member?.age ? `${member.age} 歳` : "未登録"} />
                  <Info
                    label="社会人年次"
                    value={member?.years ? `${member.years} 年次` : "未登録"}
                  />
                  <Info
                    label="現在の勤務先"
                    value={member?.currentCompany || "未登録"}
                  />
                  <Info
                    label="アクチュアリー資格"
                    value={member?.qualification ?? "-"}
                  />
                  <Info
                    label="その他資格"
                    value={member?.otherQualifications || "なし"}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-muted">
                  内容に変更がある場合は
                  <Link href="/mypage/edit" className="link ml-1">
                    登録情報の編集
                  </Link>
                  から更新してください。
                </p>
              </Group>

              <Group title="追加入力項目">
                <Field label="転職意向">
                  <select
                    className="input"
                    value={form.intent}
                    onChange={(e) => setForm({ ...form, intent: e.target.value })}
                  >
                    <option>積極的に検討中</option>
                    <option>良い求人があれば検討</option>
                    <option>情報収集段階</option>
                  </select>
                </Field>

                <Field label="応募理由">
                  <textarea
                    className="input min-h-[120px]"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="この求人に応募した理由、興味を持った点など"
                  />
                </Field>

                <Field label="現在の状況">
                  <select
                    className="input"
                    value={form.currentSituation}
                    onChange={(e) =>
                      setForm({ ...form, currentSituation: e.target.value })
                    }
                  >
                    <option>在職中（現職に勤務）</option>
                    <option>在職中（退職予定あり）</option>
                    <option>離職中</option>
                  </select>
                </Field>

                <label className="flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={form.wantsCounseling}
                    onChange={(e) =>
                      setForm({ ...form, wantsCounseling: e.target.checked })
                    }
                  />
                  キャリア面談も希望する
                </label>

                <Field label="自由記述">
                  <textarea
                    className="input min-h-[100px]"
                    value={form.freeText}
                    onChange={(e) =>
                      setForm({ ...form, freeText: e.target.value })
                    }
                    placeholder="ご質問・ご要望などがあればご記入ください"
                  />
                </Field>
              </Group>

              <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <Link
                  href={`/jobs/${job.id}`}
                  className="btn btn-ghost border border-surface-line"
                >
                  戻る
                </Link>
                <button className="btn btn-primary md:px-10">
                  入力内容を確認する
                </button>
              </div>

              <div className="mt-6 rounded-md border border-dashed border-surface-line bg-surface-warm p-4 text-xs text-ink-muted">
                連絡をスムーズに受け取れるよう、応募後の
                <Link href="/line" className="link mx-1">
                  LINE登録
                </Link>
                をおすすめしています。
              </div>
            </form>
          )}

          {step === "confirm" && (
            <form onSubmit={submit} className="card p-6 md:p-8">
              <h2 className="mb-5 text-base font-semibold text-ink">
                応募内容の確認
              </h2>

              <dl className="divide-y divide-surface-line rounded-md border border-surface-line">
                <Item label="氏名" value={member?.name ?? ""} />
                <Item label="メールアドレス" value={member?.email ?? ""} />
                <Item label="電話番号" value={member?.phone || "未登録"} />
                <Item label="転職意向" value={form.intent} />
                <Item label="応募理由" value={form.reason || "（未入力）"} />
                <Item label="現在の状況" value={form.currentSituation} />
                <Item
                  label="キャリア面談希望"
                  value={form.wantsCounseling ? "希望する" : "希望しない"}
                />
                <Item label="自由記述" value={form.freeText || "（未入力）"} />
              </dl>

              <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="btn btn-ghost border border-surface-line"
                >
                  修正する
                </button>
                <button className="btn btn-primary md:px-10">
                  この内容で応募する
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 text-sm font-semibold text-ink">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className="text-ink">{value}</p>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 px-4 py-3 text-xs md:grid-cols-[160px_1fr] md:px-5 md:py-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="whitespace-pre-wrap text-ink">{value}</dd>
    </div>
  );
}
