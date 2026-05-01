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

-- Fila de emails agendados
create table if not exists email_queue (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  day        int  not null,
  send_at    timestamptz not null,
  sent       boolean default false,
  created_at timestamptz default now(),
  unique(email, day)
);

create index if not exists email_queue_pending_idx on email_queue(send_at) where sent = false;

-- Tabela de subscribers (já pode existir)
create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);

-- Permissões service_role
grant all on table users        to service_role;
grant all on table ideas        to service_role;
grant all on table subscribers  to service_role;
grant all on table email_queue  to service_role;
