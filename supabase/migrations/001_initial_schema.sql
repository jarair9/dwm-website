-- ============================================
-- Distinct Mineral World — Database Schema
-- ============================================

-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  phone text,
  whatsapp text,
  role text not null default 'bidder',
  created_at timestamptz default now()
);

-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null
);

-- Products / Lots (gemstones, minerals)
create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  title text not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  images text[],
  metadata jsonb,
  created_at timestamptz default now()
);

-- Auctions
create table auctions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  seller_id uuid references users(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  starting_price numeric(12,2) not null default 0,
  reserve_price numeric(12,2),
  min_increment numeric(12,2) not null default 10,
  status text not null default 'scheduled',
  buy_now_price numeric(12,2),
  winner_id uuid references users(id) on delete set null,
  final_price numeric(12,2),
  payment_status text default 'pending',
  created_at timestamptz default now()
);

-- Bids (append-only)
create table bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid references auctions(id) on delete cascade,
  bidder_id uuid references users(id) on delete cascade,
  amount numeric(12,2) not null,
  placed_at timestamptz default now(),
  meta jsonb,
  constraint positive_amount check (amount > 0)
);

-- Audit events (immutable)
create table audit_events (
  id serial primary key,
  event_type text not null,
  event_time timestamptz default now(),
  payload jsonb
);

-- Banners
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  link_url text,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Indexes
create index on bids (auction_id, placed_at desc);
create index on auctions (status, start_time, end_time);
create index on auctions (product_id);
create index on products (category_id);
create index on categories (slug);
