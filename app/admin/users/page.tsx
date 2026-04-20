"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActuaryQualification, Member } from "@/lib/types";

type NewUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: string;
  years: string;
  currentCompany: string;
  qualification: ActuaryQualification;
  otherQualifications: string;
  isAdmin: boolean;
};

const EMPTY_NEW: NewUser = {
  name: "",
  email: "",
  password: "",
  phone: "",
  age: "",
  years: "",
  currentCompany: "",
  qualification: "未取得",
  otherQualifications: "",
  isAdmin: false,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<NewUser>(EMPTY_NEW);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Member> & { password?: string }>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setUsers(data.users ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          age: Number(form.age) || 0,
          years: Number(form.years) || 0,
          currentCompany: form.currentCompany,
          qualification: form.qualification,
          otherQualifications: form.otherQualifications,
          isAdmin: form.isAdmin,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setForm(EMPTY_NEW);
      setShowAdd(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "作成に失敗しました。");
    } finally {
      setCreating(false);
    }
  }

  async function saveEdit(id: string) {
    setError(null);
    try {
      const patch: Record<string, unknown> = {};
      if (typeof editDraft.name === "string") patch.name = editDraft.name;
      if (typeof editDraft.email === "string") patch.email = editDraft.email;
      if (typeof editDraft.phone === "string") patch.phone = editDraft.phone;
      if (typeof editDraft.age === "number") patch.age = editDraft.age;
      if (typeof editDraft.years === "number") patch.years = editDraft.years;
      if (typeof editDraft.currentCompany === "string") patch.currentCompany = editDraft.currentCompany;
      if (typeof editDraft.qualification === "string") patch.qualification = editDraft.qualification;
      if (typeof editDraft.otherQualifications === "string") patch.otherQualifications = editDraft.otherQualifications;
      if (typeof editDraft.isAdmin === "boolean") patch.isAdmin = editDraft.isAdmin;
      if (editDraft.password && editDraft.password.length >= 6) patch.password = editDraft.password;

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      setEditingId(null);
      setEditDraft({});
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "更新に失敗しました。");
    }
  }

  async function deleteUser(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？ この操作は取り消せません。`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "削除に失敗しました。");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-ink">ユーザー管理</h2>
        <button
          className="btn btn-primary !py-2 !px-4 text-sm"
          onClick={() => setShowAdd((v) => !v)}
        >
          {showAdd ? "閉じる" : "+ ユーザー追加"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {showAdd && (
        <form onSubmit={createUser} className="card mb-6 p-6">
          <h3 className="mb-4 text-sm font-semibold text-ink">新しいユーザーを追加</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <L label="氏名 *">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </L>
            <L label="メールアドレス *">
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </L>
            <L label="パスワード *">
              <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </L>
            <L label="電話番号">
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </L>
            <L label="年齢">
              <input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </L>
            <L label="社会人年次">
              <input type="number" className="input" value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </L>
            <L label="現在の勤務先">
              <input className="input" value={form.currentCompany} onChange={(e) => setForm({ ...form, currentCompany: e.target.value })} />
            </L>
            <L label="資格">
              <select
                className="input"
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value as ActuaryQualification })}
              >
                <option value="未取得">未取得</option>
                <option value="研究会員">研究会員</option>
                <option value="準会員">準会員</option>
                <option value="正会員">正会員</option>
              </select>
            </L>
            <L label="その他資格">
              <input className="input" value={form.otherQualifications} onChange={(e) => setForm({ ...form, otherQualifications: e.target.value })} />
            </L>
            <label className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={form.isAdmin}
                onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
              />
              管理者権限を付与する
            </label>
          </div>
          <div className="mt-5">
            <button disabled={creating} className="btn btn-primary !py-2 !px-5 text-sm disabled:opacity-60">
              {creating ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-ink-muted">読み込み中...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-ink-muted">ユーザーはいません。</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-line bg-surface-alt text-xs text-ink-muted">
                <tr>
                  <th className="px-4 py-3 text-left">アバター</th>
                  <th className="px-4 py-3 text-left">氏名</th>
                  <th className="px-4 py-3 text-left">メール</th>
                  <th className="px-4 py-3 text-left">資格</th>
                  <th className="px-4 py-3 text-left">権限</th>
                  <th className="px-4 py-3 text-left">登録日</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const editing = editingId === u.id;
                  return (
                    <tr key={u.id} className="border-b border-surface-line last:border-b-0">
                      <td className="px-4 py-3">
                        {u.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={u.avatarUrl} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[13px] font-semibold text-white">
                            {(u.name || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <input
                            className="input !py-1 !text-xs"
                            defaultValue={u.name}
                            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                          />
                        ) : (
                          <span className="font-medium text-ink">{u.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {editing ? (
                          <input
                            className="input !py-1 !text-xs"
                            defaultValue={u.email}
                            onChange={(e) => setEditDraft((d) => ({ ...d, email: e.target.value }))}
                          />
                        ) : (
                          u.email
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        {editing ? (
                          <select
                            className="input !py-1 !text-xs"
                            defaultValue={u.qualification}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, qualification: e.target.value as ActuaryQualification }))
                            }
                          >
                            <option value="未取得">未取得</option>
                            <option value="研究会員">研究会員</option>
                            <option value="準会員">準会員</option>
                            <option value="正会員">正会員</option>
                          </select>
                        ) : (
                          u.qualification
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editing ? (
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              defaultChecked={u.isAdmin}
                              onChange={(e) => setEditDraft((d) => ({ ...d, isAdmin: e.target.checked }))}
                            />
                            管理者
                          </label>
                        ) : u.isAdmin ? (
                          <span className="rounded bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">管理者</span>
                        ) : (
                          <span className="text-[11px] text-ink-muted">一般</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-ink-muted">
                        {new Date(u.createdAt).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {editing ? (
                            <>
                              <input
                                type="password"
                                placeholder="新PW(任意)"
                                className="input !py-1 !px-2 !text-xs w-24"
                                onChange={(e) => setEditDraft((d) => ({ ...d, password: e.target.value }))}
                              />
                              <button
                                className="btn btn-primary !py-1 !px-2 text-xs"
                                onClick={() => saveEdit(u.id)}
                              >
                                保存
                              </button>
                              <button
                                className="btn btn-ghost !py-1 !px-2 text-xs"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditDraft({});
                                }}
                              >
                                取消
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-outline !py-1 !px-2 text-xs"
                                onClick={() => {
                                  setEditingId(u.id);
                                  setEditDraft({});
                                }}
                              >
                                編集
                              </button>
                              <button
                                className="btn btn-ghost !py-1 !px-2 text-xs text-red-600 hover:bg-red-50"
                                onClick={() => deleteUser(u.id, u.name)}
                              >
                                削除
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
