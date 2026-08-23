-- Crystal Cabin Detailing — appointments table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  package_id text not null,
  package_name text not null,
  vehicle_type_id text not null,
  vehicle_type_name text not null,
  price numeric(10, 2) not null,
  customer jsonb not null,
  vehicle jsonb not null,
  appointment jsonb not null,
  service_location jsonb not null,
  add_ons jsonb not null default '[]'::jsonb,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_appointments_created_at
  on public.appointments (created_at desc);

create index if not exists idx_appointments_status
  on public.appointments (status);

create index if not exists idx_appointments_preferred_date
  on public.appointments ((appointment->>'preferredDate'));

-- Row Level Security: enabled with NO public policies.
-- All access goes through the server using the service role key,
-- so anonymous clients cannot read or write appointments.
alter table public.appointments enable row level security;
