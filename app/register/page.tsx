"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/lib/store";
import type { ActuaryQualification } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    years: "",
    currentCompany: "",
    qualification: "未取得" as ActuaryQualification,
    otherQualifications: "",
    password: "",
    passwordConfirm: "",
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password) {
      setError("必須項目が未入力です。");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("パスワードが一致しません。");
      return;
    }
    if (!form.agreeTerms || !form.agreePrivacy) {
      setError("利用規約・プライバシーポリシーへの同意が必要です。");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      login({
        id: `m-${Date.now()}`,
        name: form.name,
        email: form.email,
        phone: form.phone,
        age: Number(form.age) || 0,
        years: Number(form.years) || 0,
        currentCompany: form.currentCompany,
        qualification: form.qualification,
        otherQualifications: form.otherQualifications,
        createdAt: new Date().toISOString(),
      });
      router.push("/register/complete");
    }, 300);
  }

  return (
    <div className="bg-surface-warm">
      <div className="container-x py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="section-kicker">SIGN UP</p>
            <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
              無料会員登録
            </h1>
            <p className="mt-3 text-sm text-ink-soft">
              会員登録で、限定求人の閲覧・保存・応募・面談予約が可能です。
            </p>
          </div>

          <div className="card mb-6 grid gap-4 p-6 md:grid-cols-4">
            {[
              { t: "限定求人閲覧", d: "非公開求人を含む全求人を閲覧" },
              { t: "保存機能", d: "気になる求人をいつでも見返せる" },
              { t: "応募履歴確認", d: "応募状況を一元管理" },
              { t: "キャリア面談", d: "現役アクチュアリーに継続相談" },
            ].map((b) => (
              <div key={b.t} className="text-center">
                <p className="text-sm font-semibold text-brand">{b.t}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{b.d}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="card p-6 md:p-8">
            {error && (
              <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <Group title="基本情報">
              <Row>
                <Field label="氏名" required>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="山田 太郎"
                  />
                </Field>
                <Field label="メールアドレス" required>
                  <input
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="example@acecareer.jp"
                  />
                </Field>
              </Row>
              <Row>
                <Field label="電話番号">
                  <input
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="090-0000-0000"
                  />
                </Field>
                <Field label="年齢">
                  <input
                    type="number"
                    className="input"
                    value={form.age}
                    onChange={(e) => setField("age", e.target.value)}
                    placeholder="30"
                  />
                </Field>
              </Row>
            </Group>

            <Group title="キャリア情報">
              <Row>
                <Field label="社会人年次">
                  <input
                    type="number"
                    className="input"
                    value={form.years}
                    onChange={(e) => setField("years", e.target.value)}
                    placeholder="5"
                  />
                </Field>
                <Field label="現在の勤務先">
                  <input
                    className="input"
                    value={form.currentCompany}
                    onChange={(e) => setField("currentCompany", e.target.value)}
                    placeholder="○○生命保険株式会社"
                  />
                </Field>
              </Row>
              <Row>
                <Field label="アクチュアリー資格状況">
                  <select
                    className="input"
                    value={form.qualification}
                    onChange={(e) =>
                      setField(
                        "qualification",
                        e.target.value as ActuaryQualification
                      )
                    }
                  >
                    <option value="未取得">未取得</option>
                    <option value="研究会員">研究会員</option>
                    <option value="準会員">準会員</option>
                    <option value="正会員">正会員</option>
                  </select>
                </Field>
                <Field label="その他資格">
                  <input
                    className="input"
                    value={form.otherQualifications}
                    onChange={(e) =>
                      setField("otherQualifications", e.target.value)
                    }
                    placeholder="CFA、CPA、年金数理人 など"
                  />
                </Field>
              </Row>
            </Group>

            <Group title="パスワード">
              <Row>
                <Field label="パスワード" required>
                  <input
                    type="password"
                    className="input"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="8文字以上"
                  />
                </Field>
                <Field label="パスワード確認" required>
                  <input
                    type="password"
                    className="input"
                    value={form.passwordConfirm}
                    onChange={(e) =>
                      setField("passwordConfirm", e.target.value)
                    }
                  />
                </Field>
              </Row>
            </Group>

            <div className="mt-6 space-y-3 border-t border-surface-line pt-6">
              <label className="flex items-start gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => setField("agreeTerms", e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <Link href="/terms" className="link">
                    利用規約
                  </Link>
                  に同意します
                </span>
              </label>
              <label className="flex items-start gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.agreePrivacy}
                  onChange={(e) => setField("agreePrivacy", e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <Link href="/privacy" className="link">
                    プライバシーポリシー
                  </Link>
                  に同意します
                </span>
              </label>
            </div>

            <div className="mt-8">
              <button
                disabled={submitting}
                className="btn btn-primary w-full !py-3.5 text-base disabled:opacity-60"
              >
                {submitting ? "登録中..." : "無料会員登録する"}
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-ink-muted">
              すでに会員の方は
              <Link href="/login" className="link ml-1">
                こちらからログイン
              </Link>
            </p>
          </form>

          <div className="mt-6 rounded-md border border-surface-line bg-white p-5 text-xs leading-relaxed text-ink-muted">
            <p className="mb-2 font-semibold text-ink">登録後の流れ</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>本人確認メールが届きます</li>
              <li>マイページが利用可能になり、求人閲覧・保存・応募ができるようになります</li>
              <li>希望者には現役アクチュアリーによるキャリア面談をご案内します</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
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

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </span>
      {children}
    </label>
  );
}
