alter table public.products add column if not exists variants text[] not null default '{}';
