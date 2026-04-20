-- Run in Supabase SQL Editor after 001_jobs.sql.
-- Creates public.users, public avatars storage bucket, and seeds the Admin user.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id                    uuid primary key default gen_random_uuid(),
  email                 text unique not null,
  password_hash         text not null,
  name                  text not null,
  avatar_url            text,
  phone                 text not null default '',
  age                   integer not null default 0,
  years                 integer not null default 0,
  current_company       text not null default '',
  qualification         text not null default '未取得' check (qualification in ('未取得','研究会員','準会員','正会員')),
  other_qualifications  text not null default '',
  is_admin              boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists users_email_idx on public.users (lower(email));

-- All reads/writes go through the server using the service_role key, so RLS
-- is locked down (no anon access) — the server bypasses it automatically.
alter table public.users enable row level security;

drop policy if exists "users no anon read" on public.users;
-- (Intentionally no SELECT policy for anon — server uses service_role.)

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
  before update on public.users
  for each row execute function public.touch_updated_at();

-- Storage bucket for avatars (public read so <img src> works without signed URLs).
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Seed the Admin user. pgcrypto's crypt()/gen_salt('bf') produces a bcrypt
-- hash that bcryptjs.compare() can verify.
insert into public.users (name, email, password_hash, is_admin)
values ('Admin', 'Admin@gmail.com', crypt('Admin@gmail.com', gen_salt('bf', 10)), true)
on conflict (email) do update
  set is_admin = true,
      name = excluded.name,
      password_hash = excluded.password_hash;
