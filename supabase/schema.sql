-- HomeLink Database Schema
-- Mirrors the entities described in ARCHITECTURE.md Section 5 (Logical Architecture)

-- =====================
-- Users
-- =====================
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('manager', 'resident')),
  unit_id uuid,
  created_at timestamptz not null default now()
);

-- =====================
-- Units
-- =====================
create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  unit_number text not null unique,
  floor int not null,
  current_balance numeric(10,2) not null default 0,
  resident_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table users
  add constraint users_unit_fk
  foreign key (unit_id) references units(id) on delete set null;

-- =====================
-- Dues
-- =====================
create table if not exists dues (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  month text not null,
  created_at timestamptz not null default now(),
  unique (unit_id, month)
);

-- =====================
-- Payments
-- =====================
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  resident_id uuid references users(id) on delete set null,
  amount numeric(10,2) not null check (amount > 0),
  payment_date date not null default current_date,
  month text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','rejected')),
  created_at timestamptz not null default now()
);

-- =====================
-- Maintenance Requests
-- =====================
create table if not exists maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units(id) on delete cascade,
  resident_id uuid references users(id) on delete set null,
  description text not null check (length(description) >= 10),
  status text not null default 'pending' check (status in ('pending','in_progress','resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- =====================
-- Announcements
-- =====================
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =====================
-- Row Level Security
-- =====================
alter table users enable row level security;
alter table units enable row level security;
alter table dues enable row level security;
alter table payments enable row level security;
alter table maintenance_requests enable row level security;
alter table announcements enable row level security;

-- Users can read their own profile
create policy users_select_self on users
  for select using (auth.uid() = id);

-- Managers can read all users
create policy users_select_manager on users
  for select using (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

-- Anyone authenticated can read units (for the building view)
create policy units_select_all on units
  for select using (auth.role() = 'authenticated');

-- Only managers can modify units
create policy units_modify_manager on units
  for all using (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

-- Residents see their own dues; managers see all
create policy dues_select on dues
  for select using (
    exists (
      select 1 from units u where u.id = dues.unit_id and u.resident_id = auth.uid()
    )
    or exists (
      select 1 from users m where m.id = auth.uid() and m.role = 'manager'
    )
  );

create policy dues_modify_manager on dues
  for all using (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

-- Payments: residents see their own, managers see all
create policy payments_select on payments
  for select using (
    resident_id = auth.uid()
    or exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

create policy payments_insert_resident on payments
  for insert with check (resident_id = auth.uid());

create policy payments_update_manager on payments
  for update using (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

-- Maintenance: residents see their own, managers see all
create policy maintenance_select on maintenance_requests
  for select using (
    resident_id = auth.uid()
    or exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

create policy maintenance_insert_resident on maintenance_requests
  for insert with check (resident_id = auth.uid());

create policy maintenance_update_manager on maintenance_requests
  for update using (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );

-- Announcements: everyone authenticated reads, only managers write
create policy announcements_select_all on announcements
  for select using (auth.role() = 'authenticated');

create policy announcements_insert_manager on announcements
  for insert with check (
    exists (select 1 from users m where m.id = auth.uid() and m.role = 'manager')
  );
