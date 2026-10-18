-- ==============================================================================
-- Crochie Tales - Phase 1 Migration: Orders, Order Items, Shipping & Tracking
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Helper Function: update_timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------------------------
-- 2. ORDERS TABLE & CONSTRAINTS
-- ------------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique,
  status text not null default 'pending_confirmation',
  payment_status text not null default 'pending',
  payment_method text not null default 'cod',
  subtotal_amount_minor integer not null check (subtotal_amount_minor >= 0),
  shipping_amount_minor integer not null default 0 check (shipping_amount_minor >= 0),
  total_amount_minor integer not null check (total_amount_minor >= 0),
  shipping_address_snapshot jsonb not null,
  idempotency_key text unique,
  customer_notes text,
  confirmed_at timestamptz,
  confirmed_by uuid references public.profiles(id) on delete set null,
  cancelled_at timestamptz,
  cancelled_reason text,
  notification_status text not null default 'pending',
  notification_retries integer not null default 0,
  notification_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure newly added columns exist if orders table already existed
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'confirmed_at') then
    alter table public.orders add column confirmed_at timestamptz;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'confirmed_by') then
    alter table public.orders add column confirmed_by uuid references public.profiles(id) on delete set null;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'cancelled_at') then
    alter table public.orders add column cancelled_at timestamptz;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'cancelled_reason') then
    alter table public.orders add column cancelled_reason text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'notification_status') then
    alter table public.orders add column notification_status text not null default 'pending';
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'notification_retries') then
    alter table public.orders add column notification_retries integer not null default 0;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'orders' and column_name = 'notification_error') then
    alter table public.orders add column notification_error text;
  end if;
end $$;

-- Update constraints for orders
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in ('pending', 'paid', 'failed', 'refunded'));

alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check
  check (payment_method in ('cod'));

alter table public.orders drop constraint if exists orders_notification_status_check;
alter table public.orders add constraint orders_notification_status_check
  check (notification_status in ('pending', 'sent', 'failed'));

-- Set default status to pending_confirmation
alter table public.orders alter column status set default 'pending_confirmation';
alter table public.orders alter column payment_method set default 'cod';

-- Updated at trigger for orders
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 3. ORDER ITEMS TABLE & CONSTRAINTS
-- ------------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  title_snapshot text not null,
  price_snapshot_minor integer not null check (price_snapshot_minor >= 0),
  quantity integer not null default 1 check (quantity > 0),
  total_minor integer not null check (total_minor >= 0),
  created_at timestamptz not null default now()
);

-- Ensure created_at exists on order_items
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'order_items' and column_name = 'created_at') then
    alter table public.order_items add column created_at timestamptz not null default now();
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 4. ORDER STATUS HISTORY TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 5. SHIPPING SHIPMENTS (iThink Logistics)
-- ------------------------------------------------------------------------------
create table if not exists public.shipping_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade unique,
  provider text not null default 'ithink_logistics',
  ithink_order_id text,
  ithink_shipment_id text,
  awb_code text unique,
  courier_id text,
  courier_name text,
  shipping_label_url text,
  manifest_url text,
  tracking_status text not null default 'manifest_generated',
  current_status_code text,
  current_status_description text,
  estimated_delivery_date date,
  cod_amount_minor integer not null default 0 check (cod_amount_minor >= 0),
  cod_remittance_status text not null default 'pending' check (cod_remittance_status in ('pending', 'remitted', 'reconciled')),
  cod_remittance_date timestamptz,
  raw_response_metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If shipping_shipments existed previously, ensure iThink Logistics fields exist and order_id is unique
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'provider') then
    alter table public.shipping_shipments add column provider text not null default 'ithink_logistics';
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'ithink_order_id') then
    alter table public.shipping_shipments add column ithink_order_id text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'ithink_shipment_id') then
    alter table public.shipping_shipments add column ithink_shipment_id text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'courier_id') then
    alter table public.shipping_shipments add column courier_id text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'shipping_label_url') then
    alter table public.shipping_shipments add column shipping_label_url text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'manifest_url') then
    alter table public.shipping_shipments add column manifest_url text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'current_status_code') then
    alter table public.shipping_shipments add column current_status_code text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'current_status_description') then
    alter table public.shipping_shipments add column current_status_description text;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'estimated_delivery_date') then
    alter table public.shipping_shipments add column estimated_delivery_date date;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'cod_amount_minor') then
    alter table public.shipping_shipments add column cod_amount_minor integer not null default 0 check (cod_amount_minor >= 0);
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'cod_remittance_status') then
    alter table public.shipping_shipments add column cod_remittance_status text not null default 'pending' check (cod_remittance_status in ('pending', 'remitted', 'reconciled'));
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'cod_remittance_date') then
    alter table public.shipping_shipments add column cod_remittance_date timestamptz;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'shipping_shipments' and column_name = 'raw_response_metadata') then
    alter table public.shipping_shipments add column raw_response_metadata jsonb;
  end if;
end $$;

-- Enforce 1 shipment per order to avoid duplicate shipment creation
alter table public.shipping_shipments drop constraint if exists shipping_shipments_order_id_key;
alter table public.shipping_shipments add constraint shipping_shipments_order_id_key unique (order_id);

-- Updated at trigger for shipping_shipments
drop trigger if exists set_shipping_shipments_updated_at on public.shipping_shipments;
create trigger set_shipping_shipments_updated_at
  before update on public.shipping_shipments
  for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. SHIPMENT TRACKING EVENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.shipment_tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipping_shipments(id) on delete cascade,
  status_code text not null,
  status_description text not null,
  location text,
  event_timestamp timestamptz not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- 7. PERFORMANCE & SEARCH INDEXES
-- ------------------------------------------------------------------------------
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_customer_id on public.orders (customer_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at_desc on public.orders (created_at desc);
create index if not exists idx_orders_idempotency_key on public.orders (idempotency_key) where idempotency_key is not null;
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_order_status_history_order_id on public.order_status_history (order_id);
create index if not exists idx_shipping_shipments_order_id on public.shipping_shipments (order_id);
create index if not exists idx_shipping_shipments_awb_code on public.shipping_shipments (awb_code) where awb_code is not null;
create index if not exists idx_shipment_tracking_events_shipment_id on public.shipment_tracking_events (shipment_id);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.shipping_shipments enable row level security;
alter table public.shipment_tracking_events enable row level security;

-- Orders Policies
drop policy if exists "Customers view own orders" on public.orders;
create policy "Customers view own orders" on public.orders
  for select using (auth.uid() = customer_id or public.is_admin());

drop policy if exists "Users or guests can place orders" on public.orders;
create policy "Users or guests can place orders" on public.orders
  for insert with check (true);

drop policy if exists "Admin manage orders" on public.orders;
create policy "Admin manage orders" on public.orders
  for update using (public.is_admin());

drop policy if exists "Admin delete orders" on public.orders;
create policy "Admin delete orders" on public.orders
  for delete using (public.is_admin());

-- Order Items Policies
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

drop policy if exists "Admin manage order items" on public.order_items;
create policy "Admin manage order items" on public.order_items
  for update using (public.is_admin());

drop policy if exists "Admin delete order items" on public.order_items;
create policy "Admin delete order items" on public.order_items
  for delete using (public.is_admin());

-- Order Status History Policies
drop policy if exists "View order status history" on public.order_status_history;
create policy "View order status history" on public.order_status_history
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_status_history.order_id
      and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Admin manage order status history" on public.order_status_history;
create policy "Admin manage order status history" on public.order_status_history
  for all using (public.is_admin());

-- Shipping Shipments Policies
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

-- Shipment Tracking Events Policies
drop policy if exists "View shipment tracking events" on public.shipment_tracking_events;
create policy "View shipment tracking events" on public.shipment_tracking_events
  for select using (
    exists (
      select 1 from public.shipping_shipments
      join public.orders on orders.id = shipping_shipments.order_id
      where shipping_shipments.id = shipment_tracking_events.shipment_id
      and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "Admin manage tracking events" on public.shipment_tracking_events;
create policy "Admin manage tracking events" on public.shipment_tracking_events
  for all using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. SERVER-SIDE TRUSTED ORDER CREATION RPC (place_cod_order)
-- Recalculates prices against database product records; prevents price tampering;
-- Handles idempotency; initial status is 'pending_confirmation'.
-- ------------------------------------------------------------------------------
create or replace function public.place_cod_order(
  p_idempotency_key text,
  p_customer_id uuid,
  p_shipping_address jsonb,
  p_items jsonb, -- Array of { "product_id": uuid, "quantity": int }
  p_customer_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_order record;
  v_item jsonb;
  v_prod record;
  v_qty integer;
  v_item_total integer;
  v_subtotal_minor integer := 0;
  v_shipping_minor integer := 0;
  v_total_minor integer := 0;
  v_order_number text;
  v_order_id uuid;
  v_order_items_arr jsonb := '[]'::jsonb;
begin
  -- 1. Idempotency Check: Return existing order if key was already processed
  if p_idempotency_key is not null and trim(p_idempotency_key) <> '' then
    select id, order_number, total_amount_minor, status
    into v_existing_order
    from public.orders
    where idempotency_key = p_idempotency_key;

    if found then
      return jsonb_build_object(
        'success', true,
        'order_id', v_existing_order.id,
        'order_number', v_existing_order.order_number,
        'total_amount_minor', v_existing_order.total_amount_minor,
        'status', v_existing_order.status,
        'is_idempotent_duplicate', true
      );
    end if;
  end if;

  -- 2. Validate Shipping Address
  if p_shipping_address is null or
     coalesce(trim(p_shipping_address->>'fullName'), '') = '' or
     coalesce(trim(p_shipping_address->>'phone'), '') = '' or
     coalesce(trim(p_shipping_address->>'addressLine1'), '') = '' or
     coalesce(trim(p_shipping_address->>'city'), '') = '' or
     coalesce(trim(p_shipping_address->>'state'), '') = '' or
     coalesce(trim(p_shipping_address->>'postalCode'), '') = '' then
    return jsonb_build_object(
      'success', false,
      'error', 'Invalid shipping address details. Full name, phone, address, city, state, and postal code are mandatory.'
    );
  end if;

  -- 3. Validate Items Array
  if p_items is null or jsonb_array_length(p_items) = 0 then
    return jsonb_build_object(
      'success', false,
      'error', 'Order items cannot be empty.'
    );
  end if;

  -- 4. Calculate Subtotal from Trusted Database Records
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := coalesce((v_item->>'quantity')::integer, 1);
    if v_qty <= 0 then
      return jsonb_build_object('success', false, 'error', 'Item quantity must be greater than zero.');
    end if;

    select id, title, price_minor, stock_quantity, is_active
    into v_prod
    from public.products
    where id = (v_item->>'product_id')::uuid;

    if not found or not v_prod.is_active then
      return jsonb_build_object(
        'success', false,
        'error', 'One or more items in your cart is currently unavailable or discontinued.'
      );
    end if;

    v_item_total := v_prod.price_minor * v_qty;
    v_subtotal_minor := v_subtotal_minor + v_item_total;

    -- Accumulate item snapshot
    v_order_items_arr := v_order_items_arr || jsonb_build_object(
      'product_id', v_prod.id,
      'title_snapshot', v_prod.title,
      'price_snapshot_minor', v_prod.price_minor,
      'quantity', v_qty,
      'total_minor', v_item_total
    );
  end loop;

  -- 5. Calculate Shipping Fee: Free above ₹999 (99900 paise), else ₹79 (7900 paise)
  if v_subtotal_minor >= 99900 then
    v_shipping_minor := 0;
  else
    v_shipping_minor := 7900;
  end if;

  v_total_minor := v_subtotal_minor + v_shipping_minor;

  -- 6. Generate Unique Order Number (CT-XXXXXX)
  loop
    v_order_number := 'CT-' || lpad(floor(random() * 900000 + 100000)::text, 6, '0');
    exit when not exists (select 1 from public.orders where order_number = v_order_number);
  end loop;

  -- 7. Insert Order (Initial status: pending_confirmation)
  insert into public.orders (
    order_number,
    customer_id,
    status,
    payment_status,
    payment_method,
    subtotal_amount_minor,
    shipping_amount_minor,
    total_amount_minor,
    shipping_address_snapshot,
    idempotency_key,
    customer_notes,
    notification_status
  ) values (
    v_order_number,
    p_customer_id,
    'pending_confirmation',
    'pending',
    'cod',
    v_subtotal_minor,
    v_shipping_minor,
    v_total_minor,
    p_shipping_address,
    p_idempotency_key,
    p_customer_notes,
    'pending'
  ) returning id into v_order_id;

  -- 8. Insert Order Items Snapshots
  for v_item in select * from jsonb_array_elements(v_order_items_arr)
  loop
    insert into public.order_items (
      order_id,
      product_id,
      title_snapshot,
      price_snapshot_minor,
      quantity,
      total_minor
    ) values (
      v_order_id,
      (v_item->>'product_id')::uuid,
      v_item->>'title_snapshot',
      (v_item->>'price_snapshot_minor')::integer,
      (v_item->>'quantity')::integer,
      (v_item->>'total_minor')::integer
    );
  end loop;

  -- 9. Insert Initial Order Status History
  insert into public.order_status_history (
    order_id,
    status,
    notes
  ) values (
    v_order_id,
    'pending_confirmation',
    'Cash on Delivery order placed by customer. Awaiting WhatsApp confirmation.'
  );

  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal_amount_minor', v_subtotal_minor,
    'shipping_amount_minor', v_shipping_minor,
    'total_amount_minor', v_total_minor,
    'status', 'pending_confirmation',
    'payment_method', 'cod'
  );
exception
  when others then
    return jsonb_build_object(
      'success', false,
      'error', 'Database error placing order: ' || sqlerrm
    );
end;
$$;

-- ------------------------------------------------------------------------------
-- 10. GUEST ORDER LOOKUP RPC (lookup_guest_order)
-- Enables guest tracking without exposing other customer records
-- ------------------------------------------------------------------------------
create or replace function public.lookup_guest_order(p_order_number text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_items jsonb;
  v_shipment jsonb;
begin
  select
    id,
    order_number,
    status,
    payment_status,
    payment_method,
    subtotal_amount_minor,
    shipping_amount_minor,
    total_amount_minor,
    created_at
  into v_order
  from public.orders
  where lower(trim(order_number)) = lower(trim(p_order_number));

  if not found then
    return null;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', id,
    'title_snapshot', title_snapshot,
    'price_snapshot_minor', price_snapshot_minor,
    'quantity', quantity,
    'total_minor', total_minor
  )), '[]'::jsonb)
  into v_items
  from public.order_items
  where order_id = v_order.id;

  select to_jsonb(s.*)
  into v_shipment
  from (
    select
      awb_code,
      courier_name,
      tracking_status,
      estimated_delivery_date
    from public.shipping_shipments
    where order_id = v_order.id
  ) s;

  return jsonb_build_object(
    'id', v_order.id,
    'order_number', v_order.order_number,
    'status', v_order.status,
    'payment_status', v_order.payment_status,
    'payment_method', v_order.payment_method,
    'subtotal_amount_minor', v_subtotal_amount_minor,
    'shipping_amount_minor', v_shipping_amount_minor,
    'total_amount_minor', v_total_amount_minor,
    'created_at', v_order.created_at,
    'order_items', v_items,
    'shipping', v_shipment
  );
end;
$$;
