-- KKDGMS Phase 1: authentication, roles, permissions, and auditing foundation.
-- This migration is additive: it does not modify or delete legacy application tables.
-- Map legacy records to public.profiles only after their auth.users accounts are provisioned.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('ADMIN', 'FACULTY', 'STUDENT', 'WARDEN', 'TECHNICIAN', 'GUEST');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id text unique,
  full_name text not null default '',
  role public.app_role not null default 'GUEST',
  is_active boolean not null default true,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_permissions (
  id uuid primary key default gen_random_uuid(),
  role public.app_role not null,
  page_key text not null,
  can_view boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (role, page_key)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists page_permissions_set_updated_at on public.page_permissions;
create trigger page_permissions_set_updated_at before update on public.page_permissions
for each row execute function public.set_updated_at();

create or replace function public.current_role()
returns public.app_role language sql stable security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() and is_active = true; $$;

revoke all on function public.current_role() from public;
grant execute on function public.current_role() to authenticated;

create or replace function public.has_role(required_role public.app_role)
returns boolean language sql stable security definer
set search_path = public
as $$ select public.current_role() = required_role; $$;

revoke all on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to authenticated;

alter table public.profiles enable row level security;
alter table public.page_permissions enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles for select to authenticated
using (id = auth.uid() or public.has_role('ADMIN'));

drop policy if exists "profiles: admin update" on public.profiles;
create policy "profiles: admin update" on public.profiles for update to authenticated
using (public.has_role('ADMIN')) with check (public.has_role('ADMIN'));

drop policy if exists "page permissions: authenticated read" on public.page_permissions;
create policy "page permissions: authenticated read" on public.page_permissions for select to authenticated
using (true);

drop policy if exists "page permissions: admin manage" on public.page_permissions;
create policy "page permissions: admin manage" on public.page_permissions for all to authenticated
using (public.has_role('ADMIN')) with check (public.has_role('ADMIN'));

drop policy if exists "audit logs: admin read" on public.audit_logs;
create policy "audit logs: admin read" on public.audit_logs for select to authenticated
using (public.has_role('ADMIN'));

-- Writes to audit_logs must be performed by a narrowly scoped Edge Function/service
-- after server-side authorization; browser clients receive no INSERT policy.

create index if not exists profiles_role_active_idx on public.profiles(role, is_active);
create index if not exists page_permissions_role_page_idx on public.page_permissions(role, page_key);
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_id, created_at desc);
