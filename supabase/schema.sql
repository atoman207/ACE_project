-- Run this in Supabase SQL Editor once (or via supabase db push).
-- Creates the `jobs` table that the ACE Career app reads from.

create extension if not exists "pgcrypto";

create table if not exists public.jobs (
  id                 text primary key,
  company            text        not null,
  company_kind       text        not null check (
    company_kind in ('生命保険','損害保険','再保険','コンサル','信託銀行','年金','その他')
  ),
  position           text        not null,
  summary            text        not null,
  location           text        not null,
  salary             text        not null,
  salary_min         integer     not null check (salary_min > 0),
  salary_max         integer     not null check (salary_max > 0),
  employment_type    text        not null check (employment_type in ('正社員','契約社員','業務委託')),
  remote             text        not null check (remote in ('フルリモート可','一部リモート可','出社')),
  tags               text[]      not null default '{}',
  status             text        not null check (status in ('募集中','募集終了')),
  posted_at          date        not null,
  description        text        not null,
  requirements       text[]      not null default '{}',
  preferred          text[]      not null default '{}',
  company_overview   text        not null,
  work_hours         text        not null,
  benefits           text[]      not null default '{}',
  holidays           text        not null,
  selection_process  text[]      not null default '{}',
  ideal_candidate    text        not null,
  is_confidential    boolean     not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);
create index if not exists jobs_status_idx    on public.jobs (status);

-- Keep updated_at in sync on edits
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

-- Row Level Security: allow read for anon/public, writes only via service role.
alter table public.jobs enable row level security;

drop policy if exists "jobs_read_all" on public.jobs;
create policy "jobs_read_all"
  on public.jobs for select
  to anon, authenticated
  using (true);
