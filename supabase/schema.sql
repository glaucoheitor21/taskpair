-- =====================================================================
-- TaskPair — esquema do banco no Supabase (PostgreSQL)
--
-- Como usar: Supabase → SQL Editor → New query → cole este arquivo → Run.
-- É idempotente: pode rodar de novo sem quebrar nada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------

-- Perfil público de cada conta (o login em si fica em auth.users).
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null unique,
  initials   text,
  color      text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) >= 3),
  subject     text not null,
  description text,
  due_date    date not null,
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  archived    boolean not null default false
);

create table if not exists public.members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'member')),
  joined_at  date not null default current_date,
  primary key (project_id, user_id)
);

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  title        text not null check (char_length(title) >= 3),
  description  text,
  status       text not null default 'todo' check (status in ('todo', 'doing', 'review', 'done')),
  -- Peso obrigatório (Fibonacci truncado): é o que alimenta o Painel de Equilíbrio.
  weight       smallint not null check (weight in (1, 2, 3, 5, 8)),
  assignee_id  uuid references public.profiles (id) on delete set null,
  due_date     date,
  created_at   timestamptz not null default now(),
  completed_at date
);

create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists members_user_idx on public.members (user_id);

-- ---------------------------------------------------------------------
-- Perfil criado automaticamente no cadastro
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  display_name text := coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, name, email, initials)
  values (
    new.id,
    display_name,
    lower(new.email),
    upper(left(display_name, 1) || coalesce(left(split_part(display_name, ' ', 2), 1), ''))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Segurança (Row Level Security): cada um só vê os projetos de que participa
-- ---------------------------------------------------------------------
create or replace function public.is_member(p_project uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.members where project_id = p_project and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.members  enable row level security;
alter table public.tasks    enable row level security;

-- profiles: qualquer usuário logado pode ver perfis (para convidar por e-mail);
-- cada um edita só o próprio.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid());

-- projects
drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects for select to authenticated
  using (public.is_member(id) or created_by = auth.uid());
drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert" on public.projects for insert to authenticated
  with check (created_by = auth.uid());
drop policy if exists "projects_update" on public.projects;
create policy "projects_update" on public.projects for update to authenticated
  using (public.is_member(id));
drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete" on public.projects for delete to authenticated
  using (created_by = auth.uid());

-- members
drop policy if exists "members_select" on public.members;
create policy "members_select" on public.members for select to authenticated
  using (public.is_member(project_id));
drop policy if exists "members_insert" on public.members;
create policy "members_insert" on public.members for insert to authenticated
  with check (
    public.is_member(project_id)
    or exists (select 1 from public.projects p where p.id = project_id and p.created_by = auth.uid())
  );
drop policy if exists "members_delete" on public.members;
create policy "members_delete" on public.members for delete to authenticated
  using (public.is_member(project_id));

-- tasks
drop policy if exists "tasks_all" on public.tasks;
create policy "tasks_all" on public.tasks for all to authenticated
  using (public.is_member(project_id))
  with check (public.is_member(project_id));
