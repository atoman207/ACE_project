import crypto from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { ActuaryQualification, Member } from "@/lib/types";

export const SESSION_COOKIE = "ace_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  phone: string;
  age: number;
  years: number;
  current_company: string;
  qualification: ActuaryQualification;
  other_qualifications: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export function rowToMember(row: UserRow): Member {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    age: row.age ?? 0,
    years: row.years ?? 0,
    currentCompany: row.current_company ?? "",
    qualification: row.qualification ?? "未取得",
    otherQualifications: row.other_qualifications ?? "",
    avatarUrl: row.avatar_url ?? null,
    isAdmin: Boolean(row.is_admin),
    createdAt: row.created_at,
  };
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("SESSION_SECRET (or SUPABASE_SERVICE_ROLE_KEY) must be set.");
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function timingSafeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

export function encodeSession(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const body = Buffer.from(JSON.stringify({ uid: userId, exp })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined | null): { uid: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (!timingSafeEq(sig, sign(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { uid: string; exp: number };
    if (!payload.uid || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { uid: payload.uid };
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function getCurrentMember(): Promise<Member | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = decodeSession(token);
  if (!session) return null;

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("users").select("*").eq("id", session.uid).maybeSingle();
  if (error || !data) return null;
  return rowToMember(data as UserRow);
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("users").select("*").ilike("email", email.trim()).maybeSingle();
  if (error) return null;
  return (data as UserRow | null) ?? null;
}
