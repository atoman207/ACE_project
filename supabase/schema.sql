-- ============================================================================
-- ACE Career Supabase Canonical Schema
-- ============================================================================
-- This is the ONLY SQL file to maintain going forward.
-- Do not add new numbered migration SQL files in this repo.
-- Add all future schema changes to this file.
--
-- Run via Supabase SQL Editor (or `supabase db push`).
-- Designed to be safe on reruns with IF NOT EXISTS / ON CONFLICT clauses.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- shared trigger function
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- jobs
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id                  uuid primary key default gen_random_uuid(),
  company             text not null,
  company_kind        text not null check (
    company_kind in ('生命保険','損害保険','再保険','コンサル','信託銀行','年金','その他')
  ),
  position            text not null,
  summary             text not null,
  location            text not null,
  salary              text not null,
  salary_min          integer not null check (salary_min > 0),
  salary_max          integer not null check (salary_max > 0),
  employment_type     text not null default '正社員' check (employment_type in ('正社員','契約社員','業務委託')),
  remote              text not null default '出社' check (remote in ('フルリモート可','一部リモート可','出社')),
  tags                text[] not null default '{}',
  status              text not null default '募集中' check (status in ('募集中','募集終了')),
  posted_at           timestamptz not null default now(),
  description         text not null,
  requirements        text[] not null default '{}',
  preferred           text[] not null default '{}',
  company_overview    text not null,
  work_hours          text not null,
  benefits            text[] not null default '{}',
  holidays            text not null,
  selection_process   text[] not null default '{}',
  ideal_candidate     text not null,
  is_confidential     boolean not null default false,
  published           boolean not null default true,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Backward-compatible adds for already-existing tables.
alter table public.jobs add column if not exists published boolean not null default true;
alter table public.jobs add column if not exists sort_order integer not null default 0;
alter table public.jobs add column if not exists created_at timestamptz not null default now();
alter table public.jobs add column if not exists updated_at timestamptz not null default now();

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_sort_order_idx on public.jobs (sort_order asc, posted_at desc);
create index if not exists jobs_published_idx on public.jobs (published);

drop trigger if exists jobs_touch_updated_at on public.jobs;
create trigger jobs_touch_updated_at
before update on public.jobs
for each row execute function public.touch_updated_at();

alter table public.jobs enable row level security;

drop policy if exists "jobs_read_all" on public.jobs;
create policy "jobs_read_all"
  on public.jobs for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
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

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
before update on public.users
for each row execute function public.touch_updated_at();

alter table public.users enable row level security;
-- Intentionally no anon SELECT policy. App reads/writes users via service_role.

-- Storage bucket for avatars.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Seed admin user (bcrypt hash generated in Postgres).
insert into public.users (name, email, password_hash, is_admin)
values ('Admin', 'Admin@gmail.com', crypt('Admin@gmail.com', gen_salt('bf', 10)), true)
on conflict (email) do update
set is_admin = true,
    name = excluded.name,
    password_hash = excluded.password_hash;

-- ---------------------------------------------------------------------------
-- applications
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users(id) on delete cascade,
  job_id             uuid not null references public.jobs(id) on delete cascade,
  applied_at         timestamptz not null default now(),
  status             text not null default '受付済' check (status in ('受付済','確認中','書類通過','面接中','終了')),
  intent             text not null default '',
  reason             text not null default '',
  current_situation  text not null default '',
  wants_counseling   boolean not null default false,
  free_text          text not null default '',
  unique (user_id, job_id)
);

create index if not exists applications_user_idx on public.applications (user_id, applied_at desc);
create index if not exists applications_job_idx on public.applications (job_id);

alter table public.applications enable row level security;

-- ---------------------------------------------------------------------------
-- saved_jobs
-- ---------------------------------------------------------------------------
create table if not exists public.saved_jobs (
  user_id   uuid not null references public.users(id) on delete cascade,
  job_id    uuid not null references public.jobs(id) on delete cascade,
  saved_at  timestamptz not null default now(),
  primary key (user_id, job_id)
);

create index if not exists saved_jobs_user_idx on public.saved_jobs (user_id, saved_at desc);

alter table public.saved_jobs enable row level security;

-- ---------------------------------------------------------------------------
-- password_reset_tokens
-- ---------------------------------------------------------------------------
create table if not exists public.password_reset_tokens (
  token       text primary key,
  user_id     uuid not null references public.users(id) on delete cascade,
  expires_at  timestamptz not null,
  used_at     timestamptz
);

create index if not exists password_reset_tokens_user_idx on public.password_reset_tokens (user_id);
create index if not exists password_reset_tokens_expires_idx on public.password_reset_tokens (expires_at);

alter table public.password_reset_tokens enable row level security;

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  name            text not null default '',
  source          text not null default 'web',
  subscribed_at   timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_email_idx on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;
