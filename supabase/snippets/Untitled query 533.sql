create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  subscription jsonb not null,
  created_at timestamp with time zone default now()
);