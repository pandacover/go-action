-- Create the table used by Go Action when Supabase env vars are set.
create table if not exists public.action_links (
  id text primary key,
  destination_url text not null,
  clipboard_text text,
  label text,
  action_type text not null default 'copy_then_redirect'
    check (action_type in ('copy_then_redirect', 'redirect_only')),
  created_at timestamptz not null default now()
);

alter table public.action_links enable row level security;

create policy "Anyone can read action links"
  on public.action_links
  for select
  using (true);

create policy "Anyone can create action links"
  on public.action_links
  for insert
  with check (true);
