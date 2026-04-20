"use client";

import { useState, useEffect, useRef } from "react";
import MypageLayout from "@/components/MypageLayout";
import { useApp } from "@/lib/store";
import type { ActuaryQualification } from "@/lib/types";

export default function EditPage() {
  return (
    <MypageLayout title="登録情報を編集" description="プロフィール情報・キャリア情報・資格状況を更新できます。">
      <EditForm />
    </MypageLayout>
  );
}

function EditForm() {
  const { member, refreshMember } = useApp();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: 0,
    years: 0,
    currentCompany: "",
    qualification: "未取得" as ActuaryQualification,
    otherQualifications: "",
  });

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        email: member.email,
        phone: member.phone,
        age: member.age,
        years: member.years,
        currentCompany: member.currentCompany,
        qualification: member.qualification,
        otherQualifications: member.otherQualifications,
      });
    }
  }, [member]);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(typeof reader.result === "string" ? reader.result : null);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("phone", form.phone);
      body.append("age", String(form.age));
      body.append("years", String(form.years));
      body.append("currentCompany", form.currentCompany);
      body.append("qualification", form.qualification);
      body.append("otherQualifications", form.otherQualifications);
      if (avatarFile) body.append("avatar", avatarFile);

      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "include",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      await refreshMember();
      setAvatarFile(null);
      setAvatarPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-6 md:p-8">
      {saved && (
        <div className="mb-5 rounded-md border border-green-200 bg-green-50 p-3 text-xs text-green-700">
          登録情報を更新しました。
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <Group title="プロフィール画像">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface-line bg-surface-alt">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="プレビュー" className="h-full w-full object-cover" />
            ) : member?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-ink-muted">未設定</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="btn btn-outline !py-2 !px-3 text-xs self-start"
            >
              {avatarFile ? "画像を変更" : "画像をアップロード"}
            </button>
            <p className="text-[11px] text-ink-muted">JPG / PNG / GIF 推奨</p>
          </div>
        </div>
      </Group>

      <Group title="基本情報">
        <Row>
          <Field label="氏名">
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="メールアドレス">
            <input
              className="input bg-surface-alt"
              type="email"
              value={form.email}
              disabled
              readOnly
            />
          </Field>
        </Row>
        <Row>
          <Field label="電話番号">
            <input
              className="input"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="年齢">
            <input
              className="input"
              type="number"
              value={form.age || ""}
              onChange={(e) =>
                setForm({ ...form, age: Number(e.target.value) })
              }
            />
          </Field>
        </Row>
      </Group>

      <Group title="キャリア情報">
        <Row>
          <Field label="社会人年次">
            <input
              className="input"
              type="number"
              value={form.years || ""}
              onChange={(e) =>
                setForm({ ...form, years: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="現在の勤務先">
            <input
              className="input"
              value={form.currentCompany}
              onChange={(e) =>
                setForm({ ...form, currentCompany: e.target.value })
              }
            />
          </Field>
        </Row>
        <Row>
          <Field label="アクチュアリー資格状況">
            <select
              className="input"
              value={form.qualification}
              onChange={(e) =>
                setForm({
                  ...form,
                  qualification: e.target.value as ActuaryQualification,
                })
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
                setForm({ ...form, otherQualifications: e.target.value })
              }
            />
          </Field>
        </Row>
      </Group>

      <div className="mt-6 border-t border-surface-line pt-5 text-xs text-ink-muted">
        パスワード変更は
        <a href="/mypage/password" className="link ml-1">
          こちら
        </a>
        から行えます。
      </div>

      <div className="mt-6">
        <button disabled={submitting} className="btn btn-primary w-full md:w-auto md:px-10 disabled:opacity-60">
          {submitting ? "保存中..." : "変更を保存"}
        </button>
      </div>
    </form>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
