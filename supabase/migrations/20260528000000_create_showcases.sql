create table showcases (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  category    text not null check (category in ('app', 'generative_media', 'agent')),
  url         text,
  media_url   text,
  media_type  text default 'image' check (media_type in ('image', 'video')),
  tags        text[],
  published   boolean default false,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table showcases enable row level security;
create policy "public can read published showcases" on showcases for select using (published = true);
create policy "admin full access" on showcases for all using (auth.role() = 'authenticated');
