-- Run this in Supabase Dashboard → SQL Editor

create table if not exists products (
  id integer primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists categories (
  id integer primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- Allow public read access (products/categories are public)
alter table products enable row level security;
alter table categories enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Public read categories" on categories for select using (true);
