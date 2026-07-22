-- Sellmate auth schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).
--
-- Security model: the API talks to Supabase using the SERVICE ROLE key only,
-- from the server, never from a browser/mobile client. Row Level Security is
-- enabled on both tables with NO policies defined, which means anon/authenticated
-- (client-side) keys get zero access by default. Only the service role key
-- (which bypasses RLS) can read/write these tables. Do not add permissive
-- policies to these tables unless you also change how the client accesses them.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  role text not null default 'employee' check (role in ('owner', 'employee')),
  failed_login_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_email_lower_idx on public.users (lower(email));

-- Refresh tokens are stored as a SHA-256 hash only — the raw token never
-- touches the database, mirroring how you'd store a password.
-- `family_id` links every token produced by rotating a single login session,
-- so a reuse of an already-rotated token lets us revoke the whole chain
-- (a strong signal the refresh token was stolen).
create table if not exists public.refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  family_id uuid not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  replaced_by_id uuid references public.refresh_tokens (id),
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists refresh_tokens_user_id_idx on public.refresh_tokens (user_id);
create index if not exists refresh_tokens_family_id_idx on public.refresh_tokens (family_id);
create index if not exists refresh_tokens_token_hash_idx on public.refresh_tokens (token_hash);

alter table public.users enable row level security;
alter table public.refresh_tokens enable row level security;

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();
