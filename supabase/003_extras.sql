-- Run in Supabase SQL Editor after 001_jobs.sql and 002_users.sql.
-- Adds applications, saved_jobs, password_reset_tokens, newsletter_subscribers,
-- and jobs.sort_order for ordering.

create extension if not exists "pgcrypto";

-- sort_order lets admins manually reorder jobs. Lower = earlier.
alter table public.jobs
  add column if not exists sort_order integer not null default 0;

-- published separates site visibility (公開/非公開) from status (募集中/募集終了).
alter table public.jobs
  add column if not exists published boolean not null default true;

create index if not exists jobs_sort_order_idx on public.jobs (sort_order asc, posted_at desc);
create index if not exists jobs_published_idx on public.jobs (published);

-- applications --------------------------------------------------------------
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
-- server uses service_role; no anon policies.

-- saved_jobs ----------------------------------------------------------------
create table if not exists public.saved_jobs (
  user_id   uuid not null references public.users(id) on delete cascade,
  job_id    uuid not null references public.jobs(id) on delete cascade,
  saved_at  timestamptz not null default now(),
  primary key (user_id, job_id)
);

create index if not exists saved_jobs_user_idx on public.saved_jobs (user_id, saved_at desc);

alter table public.saved_jobs enable row level security;

-- password_reset_tokens ----------------------------------------------------
create table if not exists public.password_reset_tokens (
  token       text primary key,
  user_id     uuid not null references public.users(id) on delete cascade,
  expires_at  timestamptz not null,
  used_at     timestamptz
);

create index if not exists password_reset_tokens_user_idx on public.password_reset_tokens (user_id);
create index if not exists password_reset_tokens_expires_idx on public.password_reset_tokens (expires_at);

alter table public.password_reset_tokens enable row level security;

-- newsletter_subscribers --------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  name          text not null default '',
  source        text not null default 'web',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists newsletter_email_idx on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;
