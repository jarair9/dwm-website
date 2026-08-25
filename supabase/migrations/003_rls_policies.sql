-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
alter table users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table auctions enable row level security;
alter table bids enable row level security;
alter table audit_events enable row level security;
alter table banners enable row level security;

-- ============================================
-- Categories: public read, admin write
-- ============================================
create policy "Categories are viewable by everyone"
  on categories for select
  using (true);

create policy "Only admins can insert categories"
  on categories for insert
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update categories"
  on categories for update
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can delete categories"
  on categories for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Products: public read, admin write
-- ============================================
create policy "Products are viewable by everyone"
  on products for select
  using (true);

create policy "Only admins can insert products"
  on products for insert
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update products"
  on products for update
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can delete products"
  on products for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Auctions: public read, admin write
-- ============================================
create policy "Auctions are viewable by everyone"
  on auctions for select
  using (true);

create policy "Only admins can insert auctions"
  on auctions for insert
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update auctions"
  on auctions for update
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can delete auctions"
  on auctions for delete
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Bids: authenticated users can read, insert via RPC only
-- ============================================
create policy "Bids are viewable by authenticated users"
  on bids for select
  using (auth.role() = 'authenticated');

-- Bids are inserted via place_bid RPC (security definer)
-- No direct insert policy needed

-- ============================================
-- Users: own profile read/update, admin read all
-- ============================================
create policy "Users can view own profile"
  on users for select
  using (auth.uid() = id);

create policy "Admins can view all users"
  on users for select
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Admins can update all users"
  on users for update
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Audit events: admin only
-- ============================================
create policy "Only admins can view audit events"
  on audit_events for select
  using (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Banners: public read, admin write
-- ============================================
create policy "Active banners are viewable by everyone"
  on banners for select
  using (active = true);

create policy "Admins can view all banners"
  on banners for select
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can insert banners"
  on banners for insert
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update banners"
  on banners for update
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can delete banners"
  on banners for delete
  using (auth.jwt() ->> 'role' = 'admin');
