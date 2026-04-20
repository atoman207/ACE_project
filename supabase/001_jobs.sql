-- Run this in the Supabase SQL Editor (Project → SQL → New query → Run).
-- Creates public.jobs with the columns lib/jobs-data.ts expects and seeds 4 rows.

create extension if not exists "pgcrypto";

create table if not exists public.jobs (
  id               uuid primary key default gen_random_uuid(),
  company          text not null,
  company_kind     text not null check (company_kind in ('生命保険','損害保険','再保険','コンサル','信託銀行','年金','その他')),
  position         text not null,
  summary          text not null,
  location         text not null,
  salary           text not null,
  salary_min       integer not null check (salary_min > 0),
  salary_max       integer not null check (salary_max > 0),
  employment_type  text not null default '正社員' check (employment_type in ('正社員','契約社員','業務委託')),
  remote           text not null default '出社' check (remote in ('フルリモート可','一部リモート可','出社')),
  tags             text[] not null default '{}',
  status           text not null default '募集中' check (status in ('募集中','募集終了')),
  posted_at        timestamptz not null default now(),
  description      text not null,
  requirements     text[] not null,
  preferred        text[] not null default '{}',
  company_overview text not null,
  work_hours       text not null,
  benefits         text[] not null,
  holidays         text not null,
  selection_process text[] not null,
  ideal_candidate  text not null,
  is_confidential  boolean not null default false
);

create index if not exists jobs_posted_at_idx on public.jobs (posted_at desc);

alter table public.jobs enable row level security;

drop policy if exists "jobs are readable by everyone" on public.jobs;
create policy "jobs are readable by everyone"
  on public.jobs for select
  using (true);

insert into public.jobs (
  company, company_kind, position, summary, location, salary, salary_min, salary_max,
  employment_type, remote, tags, status, description, requirements, preferred,
  company_overview, work_hours, benefits, holidays, selection_process, ideal_candidate, is_confidential
) values
(
  '大手生命保険A社', '生命保険', 'アクチュアリー（商品開発）',
  '新商品の収益性分析と料率計算を担うポジション。',
  '東京都千代田区', '年収800万円〜1,400万円', 800, 1400,
  '正社員', '一部リモート可',
  array['商品開発','料率計算','収益性分析'],
  '募集中',
  '生命保険の新商品開発における料率計算、収益性分析、責任準備金評価を担当します。',
  array['アクチュアリー準会員以上','数理業務の実務経験3年以上'],
  array['正会員資格保持者','Python/R等での分析経験'],
  '国内最大手の生命保険会社。数理部門は40名規模。',
  '9:00〜17:30（フレックス制）',
  array['各種社会保険完備','資格取得支援','退職金制度'],
  '完全週休2日制（土日祝）、年末年始、有給休暇',
  array['書類選考','一次面接','二次面接','最終面接'],
  'チームで協業しながら着実に成果を出せる方。',
  false
),
(
  '損保大手B社', '損害保険', 'アクチュアリー（自然災害モデリング）',
  '自然災害リスクの定量評価を担う新設ポジション。',
  '東京都新宿区', '年収900万円〜1,600万円', 900, 1600,
  '正社員', 'フルリモート可',
  array['自然災害','ERM','リスクモデル'],
  '募集中',
  '地震・台風・洪水等の巨大災害モデルを用いたリスク評価と再保険戦略の策定を行います。',
  array['数理・統計の素養','Python/Rでのモデリング経験'],
  array['CATモデル（RMS/AIR）使用経験','英語でのコミュニケーション'],
  '国内シェアトップクラスの損保会社。ERM部門強化中。',
  '9:30〜18:00（フレックス・コアタイムなし）',
  array['社会保険完備','在宅勤務手当','書籍購入補助'],
  '完全週休2日制、祝日、夏季・年末年始休暇',
  array['書類選考','カジュアル面談','技術面接','最終面接'],
  '新しい領域に挑戦する意欲のある方。',
  false
),
(
  '外資系コンサルC社', 'コンサル', 'アクチュアリーコンサルタント',
  'M&Aデューデリや保険会社向け数理コンサルを担当。',
  '東京都港区', '年収1,000万円〜2,000万円', 1000, 2000,
  '正社員', '一部リモート可',
  array['コンサル','M&A','IFRS17'],
  '募集中',
  '保険会社向けの数理アドバイザリー、M&Aデューデリジェンス、IFRS17導入支援に従事します。',
  array['アクチュアリー準会員以上','保険会社での実務経験5年以上','英語ビジネスレベル'],
  array['IFRS17プロジェクト経験','海外拠点との協業経験'],
  'Big4系の大手コンサルファーム。保険アクチュアリーチーム拡大中。',
  '裁量労働制',
  array['社会保険完備','成果連動ボーナス','海外研修機会'],
  '土日祝、年末年始、年次有給休暇20日',
  array['書類選考','ケース面接','パートナー面接'],
  '高いプロ意識と学習意欲を持つ方。',
  true
),
(
  '信託銀行D社', '信託銀行', '年金数理担当',
  '企業年金の数理計算と制度設計を担当。',
  '東京都中央区', '年収700万円〜1,200万円', 700, 1200,
  '正社員', '出社',
  array['年金数理','制度設計','DB'],
  '募集中',
  '確定給付企業年金（DB）の財政計算、制度設計コンサル、顧客対応を担当します。',
  array['年金数理人または準会員','企業年金の実務経験'],
  array['年金数理人資格','顧客折衝経験'],
  '信託業界大手。年金ソリューション部門の中核。',
  '9:00〜17:00',
  array['社会保険完備','住宅手当','退職金・企業年金'],
  '土日祝、年末年始、創立記念日',
  array['書類選考','一次面接','二次面接','役員面接'],
  '顧客に寄り添って課題解決できる方。',
  false
);
