-- ==============================================================================
-- Crochie Tales - Production PostgreSQL Schema & Initial Seed
-- Phase 4: Supabase Setup and Database Design
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/rclxmrnzqpcdnojxahem/sql)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to auto-create profile upon auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------------------------
-- 2. CUSTOMER ADDRESS BOOK
-- ------------------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES & COLLECTIONS
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  banner_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 4. PRODUCTS & PRODUCT IMAGES
-- ------------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  sku text unique,
  price_minor integer not null check (price_minor >= 0), -- Stored in paise (e.g. 29900 = ₹299.00)
  compare_at_price_minor integer check (compare_at_price_minor >= 0),
  stock_quantity integer not null default 10 check (stock_quantity >= 0),
  category_id uuid references public.categories(id) on delete set null,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  tag text, -- 'Bestseller', 'Sale', 'New', etc.
  short_description text,
  description text,
  rating numeric(2,1) not null default 5.0,
  review_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (collection_id, product_id)
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS & CHECKOUT
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text not null default 'cod' check (payment_method in ('cod', 'online')),
  total_amount_minor integer not null check (total_amount_minor >= 0),
  subtotal_amount_minor integer not null check (subtotal_amount_minor >= 0),
  shipping_amount_minor integer not null default 0 check (shipping_amount_minor >= 0),
  shipping_address_snapshot jsonb not null,
  idempotency_key text unique,
  customer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title_snapshot text not null,
  price_snapshot_minor integer not null check (price_snapshot_minor >= 0),
  quantity integer not null default 1 check (quantity > 0),
  total_minor integer not null check (total_minor >= 0)
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  notes text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 6. SHIPPING & SHIPROCKET INTEGRATION
-- ------------------------------------------------------------------------------
create table if not exists public.shipping_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  shiprocket_order_id text,
  shiprocket_shipment_id text,
  awb_code text,
  courier_name text,
  tracking_status text,
  tracking_url text,
  label_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 7. WORKSHOPS & REGISTRATIONS
-- ------------------------------------------------------------------------------
create table if not exists public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  format text not null default 'offline' check (format in ('offline', 'online')),
  price_minor integer not null default 0 check (price_minor >= 0),
  venue_or_link text,
  image_url text,
  duration text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_sessions (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  capacity integer not null default 15 check (capacity > 0),
  booked_count integer not null default 0 check (booked_count >= 0),
  status text not null default 'open' check (status in ('open', 'full', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workshop_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  attendee_name text not null,
  attendee_email text not null,
  attendee_phone text not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'attended', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 8. REVIEWS & WISHLISTS
-- ------------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.collection_products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.shipping_shipments enable row level security;
alter table public.workshops enable row level security;
alter table public.workshop_sessions enable row level security;
alter table public.workshop_registrations enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Profiles: Own profile or admin
drop policy if exists "Profiles are viewable by owner or admin" on public.profiles;
create policy "Profiles are viewable by owner or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles can be updated by owner or admin" on public.profiles;
create policy "Profiles can be updated by owner or admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- Addresses: Owner or admin
drop policy if exists "Addresses viewable by owner or admin" on public.addresses;
create policy "Addresses viewable by owner or admin" on public.addresses
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Addresses editable by owner" on public.addresses;
create policy "Addresses editable by owner" on public.addresses
  for all using (auth.uid() = user_id);

-- Catalog: Public read-only for active items, admin full access
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories" on public.categories
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage categories" on public.categories;
create policy "Admin manage categories" on public.categories
  for all using (public.is_admin());

drop policy if exists "Public read active collections" on public.collections;
create policy "Public read active collections" on public.collections
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage collections" on public.collections;
create policy "Admin manage collections" on public.collections
  for all using (public.is_admin());

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage products" on public.products;
create policy "Admin manage products" on public.products
  for all using (public.is_admin());

drop policy if exists "Public read product images" on public.product_images;
create policy "Public read product images" on public.product_images
  for select using (true);

drop policy if exists "Admin manage product images" on public.product_images;
create policy "Admin manage product images" on public.product_images
  for all using (public.is_admin());

drop policy if exists "Public read collection products" on public.collection_products;
create policy "Public read collection products" on public.collection_products
  for select using (true);

drop policy if exists "Admin manage collection products" on public.collection_products;
create policy "Admin manage collection products" on public.collection_products
  for all using (public.is_admin());

-- Orders: Customer can read own orders, anon/auth can insert, admin can manage
drop policy if exists "Customers view own orders" on public.orders;
create policy "Customers view own orders" on public.orders
  for select using (auth.uid() = customer_id or public.is_admin());

drop policy if exists "Users or guests can place orders" on public.orders;
create policy "Users or guests can place orders" on public.orders
  for insert with check (true);

drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders" on public.orders
  for update using (public.is_admin());

-- Order Items: Linked to order
drop policy if exists "Customers view own order items" on public.order_items;
create policy "Customers view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Guests can insert order items" on public.order_items;
create policy "Guests can insert order items" on public.order_items
  for insert with check (true);

-- Shipping Shipments: Viewable by owner of order or admin
drop policy if exists "View shipment tracking" on public.shipping_shipments;
create policy "View shipment tracking" on public.shipping_shipments
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = shipping_shipments.order_id
      and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Admin manage shipments" on public.shipping_shipments;
create policy "Admin manage shipments" on public.shipping_shipments
  for all using (public.is_admin());

-- Workshops: Public read, admin manage
drop policy if exists "Public view active workshops" on public.workshops;
create policy "Public view active workshops" on public.workshops
  for select using (is_active = true or public.is_admin());

drop policy if exists "Admin manage workshops" on public.workshops;
create policy "Admin manage workshops" on public.workshops
  for all using (public.is_admin());

drop policy if exists "Public view workshop sessions" on public.workshop_sessions;
create policy "Public view workshop sessions" on public.workshop_sessions
  for select using (true);

drop policy if exists "Admin manage workshop sessions" on public.workshop_sessions;
create policy "Admin manage workshop sessions" on public.workshop_sessions
  for all using (public.is_admin());

drop policy if exists "Users view own registrations" on public.workshop_registrations;
create policy "Users view own registrations" on public.workshop_registrations
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Guests can register workshops" on public.workshop_registrations;
create policy "Guests can register workshops" on public.workshop_registrations
  for insert with check (true);

-- Reviews: Public read approved, authenticated insert, admin manage
drop policy if exists "Public read approved reviews" on public.reviews;
create policy "Public read approved reviews" on public.reviews
  for select using (is_approved = true or public.is_admin());

drop policy if exists "Users can submit reviews" on public.reviews;
create policy "Users can submit reviews" on public.reviews
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin manage reviews" on public.reviews;
create policy "Admin manage reviews" on public.reviews
  for all using (public.is_admin());

-- Wishlists: Owner manage
drop policy if exists "Users manage own wishlist" on public.wishlists;
create policy "Users manage own wishlist" on public.wishlists
  for all using (auth.uid() = user_id);

-- Admin Audit Logs: Admin only
drop policy if exists "Admin audit logs" on public.admin_audit_logs;
create policy "Admin audit logs" on public.admin_audit_logs
  for all using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. INITIAL SEED DATA
-- ------------------------------------------------------------------------------

-- Insert Categories
insert into public.categories (name, slug, description, image_url, sort_order)
values
  ('Hair Accessories', 'hair-accessories', 'Charming crochet clips, scrunchies, and hair ties', '/images/categories/hair-accessories.webp', 1),
  ('Keychains', 'keychains', 'Cute pocket-sized crochet companions & charms', '/images/categories/keychains.webp', 2),
  ('Flower Bouquets', 'flower-bouquets', 'Everlasting crochet florals that never wither', '/images/categories/flower-bouquets.webp', 3),
  ('Wearables', 'wearables', 'Cozy beanies, hats, granny square tops & scarves', '/images/categories/wearables.webp', 4),
  ('Plushies', 'plushies', 'Soft amigurumi creatures lovingly stuffed with happiness', '/images/categories/plushies.webp', 5),
  ('Other Things', 'other-things', 'Bookmarks, mug rugs, coasters & festive decor', '/images/categories/other-things.webp', 6)
on conflict (slug) do nothing;

-- Insert Collections
insert into public.collections (name, slug, description, is_active)
values
  ('Best Sellers', 'best-sellers', 'Our most cherished handcrafted designs loved by customers across India', true),
  ('Sale Finds', 'sale-finds', 'Special discounts on selected handcrafted treasures', true),
  ('Gift Ideas', 'gift-ideas', 'Thoughtfully packaged crochet keepsakes for your loved ones', true),
  ('Gifts for Her', 'gifts-for-her', 'Delicate florals, pastel clips, and romantic bouquets', true),
  ('Gifts for Him', 'gifts-for-him', 'Minimal keychains, desk companions, and wearable warmers', true)
on conflict (slug) do nothing;

-- Insert Initial Products
insert into public.products (title, slug, sku, price_minor, compare_at_price_minor, stock_quantity, category_id, is_featured, is_active, tag, short_description, rating, review_count)
values
  (
    'Daisy Keychain',
    'daisy-keychain',
    'CT-KC-001',
    19900,
    29900,
    25,
    (select id from public.categories where slug = 'keychains' limit 1),
    true,
    true,
    'Sale',
    'Delicate handcrafted daisy flower charm with premium gold metal ring.',
    4.7,
    76
  ),
  (
    'Tulip Bouquet',
    'tulip-bouquet',
    'CT-FB-001',
    89900,
    119900,
    12,
    (select id from public.categories where slug = 'flower-bouquets' limit 1),
    true,
    true,
    'Bestseller',
    'Everlasting pastel tulip bunch wrapped in textured butter paper.',
    5.0,
    124
  ),
  (
    'Bow Hair Clip',
    'bow-hair-clip',
    'CT-HA-001',
    29900,
    49900,
    30,
    (select id from public.categories where slug = 'hair-accessories' limit 1),
    true,
    true,
    'Bestseller',
    'Vintage-style crochet ribbon hair clip with sturdy alligator clamp.',
    4.9,
    98
  ),
  (
    'Sunflower Desk Pot',
    'sunflower-desk-pot',
    'CT-FB-002',
    54900,
    69900,
    15,
    (select id from public.categories where slug = 'flower-bouquets' limit 1),
    false,
    true,
    'New',
    'Cheerful crochet sunflower in a handmade terracotta-toned yarn pot.',
    4.8,
    42
  ),
  (
    'Strawberry Bucket Hat',
    'strawberry-bucket-hat',
    'CT-WR-001',
    79900,
    99900,
    8,
    (select id from public.categories where slug = 'wearables' limit 1),
    false,
    true,
    null,
    'Breathable summer bucket hat adorned with mini crochet strawberries.',
    4.9,
    31
  ),
  (
    'Lavender Sprig Bundle',
    'lavender-sprig-bundle',
    'CT-FB-003',
    44900,
    59900,
    18,
    (select id from public.categories where slug = 'flower-bouquets' limit 1),
    false,
    true,
    null,
    'Set of 3 calming purple lavender stems for your vase or study desk.',
    4.7,
    19
  ),
  (
    'Cozy Bear Plushie',
    'cozy-bear-plushie',
    'CT-PL-001',
    99900,
    129900,
    6,
    (select id from public.categories where slug = 'plushies' limit 1),
    true,
    true,
    'Bestseller',
    'Ultra-soft milk cotton amigurumi teddy bear with a tiny red scarf.',
    5.0,
    64
  ),
  (
    'Mini Cactus Charm',
    'mini-cactus-charm',
    'CT-OT-001',
    17900,
    24900,
    40,
    (select id from public.categories where slug = 'other-things' limit 1),
    false,
    true,
    null,
    'Prick-free pocket cactus companion to attach to bags or backpacks.',
    4.6,
    27
  )
on conflict (slug) do nothing;

-- Insert Product Images
insert into public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
select id, '/images/products/daisy-keychain.webp', 'Daisy Keychain', 0, true
from public.products where slug = 'daisy-keychain'
on conflict do nothing;

insert into public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
select id, '/images/products/tulip-bouquet.webp', 'Tulip Bouquet', 0, true
from public.products where slug = 'tulip-bouquet'
on conflict do nothing;

insert into public.product_images (product_id, image_url, alt_text, sort_order, is_primary)
select id, '/images/products/bow-hair-clip.webp', 'Bow Hair Clip', 0, true
from public.products where slug = 'bow-hair-clip'
on conflict do nothing;

-- Insert Initial Workshop
insert into public.workshops (title, slug, description, format, price_minor, venue_or_link, duration, is_active)
values
  (
    'Beginners Crochet Masterclass',
    'beginners-crochet-masterclass',
    'Learn foundational crochet stitches, slip knots, single and double crochet, and create your very first granny square!',
    'offline',
    129900,
    'Crochie Studio, Pune / Online via Zoom',
    '2.5 Hours',
    true
  )
on conflict (slug) do nothing;

insert into public.workshop_sessions (workshop_id, start_time, end_time, capacity, booked_count, status)
select
  id,
  now() + interval '5 days',
  now() + interval '5 days' + interval '2 hours 30 minutes',
  12,
  4,
  'open'
from public.workshops where slug = 'beginners-crochet-masterclass'
limit 1;
