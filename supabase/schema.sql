-- ============================================================
-- STHINXY CMS — Supabase schema
-- Rode isso no SQL Editor do Supabase.
-- Troque SEU_EMAIL_ADMIN_AQUI pelo e-mail do seu usuário admin.
-- ============================================================

create table if not exists public.site_settings (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site content" on public.site_settings;
create policy "Public can read site content"
on public.site_settings
for select
to anon, authenticated
using (id = 'main');

drop policy if exists "Admin can insert site content" on public.site_settings;
create policy "Admin can insert site content"
on public.site_settings
for insert
to authenticated
with check (auth.email() = 'venanciobeatriz620@gmail.com');

drop policy if exists "Admin can update site content" on public.site_settings;
create policy "Admin can update site content"
on public.site_settings
for update
to authenticated
using (auth.email() = 'venanciobeatriz620@gmail.com')
with check (auth.email() = 'venanciobeatriz620@gmail.com');

insert into public.site_settings (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
