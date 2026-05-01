-- Rodar no Supabase Dashboard > SQL Editor

create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

create table if not exists ideas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id) on delete cascade,
  profile    jsonb not null,
  idea       jsonb not null,
  created_at timestamptz default now()
);

create index if not exists ideas_user_id_idx on ideas(user_id);

-- Tabela de subscribers (já pode existir)
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);
