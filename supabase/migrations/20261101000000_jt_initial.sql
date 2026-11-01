-- JTPO_S initial store schema: electronics catalogue, Moolre checkout, enquiries and admin access.
create extension if not exists pgcrypto;

create table if not exists public.store_settings (
  id boolean primary key default true check (id = true),
  store_name text not null default 'JT',
  tagline text default 'Tech for the life you’re building.',
  email text,
  phone text,
  whatsapp text,
  domain text,
  address text,
  snapchat text,
  instagram text,
  facebook text,
  tiktok text,
  x text,
  business_latitude numeric(10,7) not null default 5.603717,
  business_longitude numeric(10,7) not null default -0.186964,
  delivery_rate numeric(10,2) not null default 10 check (delivery_rate >= 0),
  delivery_distance_unit numeric(10,2) not null default 7 check (delivery_distance_unit > 0),
  distance_multiplier numeric(10,2) not null default 1 check (distance_multiplier > 0),
  max_delivery_distance_km numeric(10,2),
  low_stock_default integer not null default 5 check (low_stock_default >= 0),
  moolre_enabled boolean not null default true,
  store_open boolean not null default true,
  maintenance_mode boolean not null default false,
  currency text not null default 'GHS' check (currency = 'GHS'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.store_settings (id, store_name, tagline)
values (true, 'JT', 'Tech for the life you’re building.')
on conflict (id) do nothing;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'assistant')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public, auth, pg_temp
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_assistant()
returns boolean
language sql stable security definer
set search_path = public, auth, pg_temp
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid() and role = 'assistant');
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_assistant() to authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text not null default 'Phones & Tablets',
  collection_type text not null default 'curated' check (collection_type in ('jt_original', 'curated')),
  brand_note text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  sku text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  image_url text,
  additional_images jsonb not null default '[]'::jsonb check (jsonb_typeof(additional_images) = 'array'),
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  special_offer boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists products_sku_unique on public.products (sku) where sku is not null and btrim(sku) <> '';
create index if not exists products_active_category_idx on public.products (active, category, created_at desc);
create index if not exists products_collection_idx on public.products (collection_type, active, created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  whatsapp_number text,
  delivery_address text not null,
  delivery_region text not null,
  delivery_instructions text,
  delivery_latitude numeric(10,7) not null,
  delivery_longitude numeric(10,7) not null,
  distance_km numeric(10,2) not null default 0,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  currency text not null default 'GHS' check (currency = 'GHS'),
  payment_method text not null default 'moolre' check (payment_method = 'moolre'),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'pending' check (order_status in ('pending', 'confirmed', 'processing', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  momo_number text,
  momo_network text,
  moolre_reference text not null unique,
  moolre_transaction_id text unique,
  amount_paid numeric(12,2) not null default 0,
  paid_at timestamptz,
  payment_metadata jsonb not null default '{}'::jsonb,
  tracking_token text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_email_idx on public.orders (lower(customer_email), created_at desc);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  product_price_snapshot numeric(12,2) not null check (product_price_snapshot >= 0),
  quantity integer not null check (quantity between 1 and 100),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_name text not null check (char_length(btrim(customer_name)) between 2 and 100),
  rating integer not null check (rating between 1 and 5),
  review_text text not null check (char_length(btrim(review_text)) between 3 and 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_approved_idx on public.reviews (product_id, approved, created_at desc);

create table if not exists public.product_enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  customer_name text not null check (char_length(btrim(customer_name)) between 2 and 100),
  email text not null,
  phone text,
  message text not null check (char_length(btrim(message)) between 5 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_enquiries_created_idx on public.product_enquiries (created_at desc);

create table if not exists public.track_order_attempts (
  order_key text primary key,
  window_started_at timestamptz not null default now(),
  failures integer not null default 0
);

create table if not exists public.customer_order_lookup_attempts (
  key_hash text primary key,
  attempted_at timestamptz[] not null default '{}'::timestamptz[]
);

create table if not exists public.guest_order_access_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.store_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.product_enquiries enable row level security;
alter table public.track_order_attempts enable row level security;
alter table public.customer_order_lookup_attempts enable row level security;
alter table public.guest_order_access_tokens enable row level security;

grant select on public.products, public.reviews to anon, authenticated;
grant insert on public.reviews, public.product_enquiries to anon, authenticated;
grant select, insert, update, delete on public.products, public.admin_users, public.reviews to authenticated;
grant select, update on public.product_enquiries to authenticated;
grant select on public.orders, public.order_items to authenticated;

drop policy if exists store_settings_public_read on public.store_settings;
create policy store_settings_public_read on public.store_settings for select to anon using (true);
drop policy if exists store_settings_admin_read on public.store_settings;
create policy store_settings_admin_read on public.store_settings for select to authenticated using (public.is_admin());
drop policy if exists store_settings_admin_update on public.store_settings;
create policy store_settings_admin_update on public.store_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.store_settings from anon, authenticated;
grant select (id, store_name, tagline, email, phone, whatsapp, domain, snapchat, instagram, facebook, tiktok, x, max_delivery_distance_km, moolre_enabled, store_open, maintenance_mode, currency) on public.store_settings to anon;
grant select, update on public.store_settings to authenticated;

drop policy if exists admin_users_read_self_or_admin on public.admin_users;
create policy admin_users_read_self_or_admin on public.admin_users for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists admin_users_admin_manage on public.admin_users;
create policy admin_users_admin_manage on public.admin_users for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists products_public_read_active on public.products;
create policy products_public_read_active on public.products for select to anon, authenticated using (active or public.is_admin());
drop policy if exists products_admin_manage on public.products;
create policy products_admin_manage on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_admin_read on public.orders;
create policy orders_admin_read on public.orders for select to authenticated using (public.is_admin());
drop policy if exists orders_assistant_read on public.orders;
create policy orders_assistant_read on public.orders for select to authenticated using (public.is_assistant());
drop policy if exists order_items_admin_read on public.order_items;
create policy order_items_admin_read on public.order_items for select to authenticated using (public.is_admin());
drop policy if exists order_items_assistant_read on public.order_items;
create policy order_items_assistant_read on public.order_items for select to authenticated using (public.is_assistant());

drop policy if exists reviews_public_read_approved on public.reviews;
create policy reviews_public_read_approved on public.reviews for select to anon, authenticated using (approved or public.is_admin());
drop policy if exists reviews_public_submit_pending on public.reviews;
create policy reviews_public_submit_pending on public.reviews for insert to anon, authenticated with check (approved = false);
drop policy if exists reviews_admin_manage on public.reviews;
create policy reviews_admin_manage on public.reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists enquiries_public_submit on public.product_enquiries;
create policy enquiries_public_submit on public.product_enquiries for insert to anon, authenticated with check (status = 'new');
drop policy if exists enquiries_admin_read on public.product_enquiries;
create policy enquiries_admin_read on public.product_enquiries for select to authenticated using (public.is_admin());
drop policy if exists enquiries_admin_update on public.product_enquiries;
create policy enquiries_admin_update on public.product_enquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists track_attempts_block_clients on public.track_order_attempts;
create policy track_attempts_block_clients on public.track_order_attempts for all to anon, authenticated using (false) with check (false);
drop policy if exists lookup_attempts_block_clients on public.customer_order_lookup_attempts;
create policy lookup_attempts_block_clients on public.customer_order_lookup_attempts for all to anon, authenticated using (false) with check (false);
drop policy if exists guest_tokens_block_clients on public.guest_order_access_tokens;
create policy guest_tokens_block_clients on public.guest_order_access_tokens for all to anon, authenticated using (false) with check (false);

create or replace function public.calculate_distance_km(p_latitude numeric, p_longitude numeric)
returns numeric language plpgsql stable security definer set search_path = public, pg_temp as $$
declare v_hub_lat numeric; v_hub_lng numeric; v_cos numeric;
begin
  if p_latitude is null or p_longitude is null or p_latitude not between -90 and 90 or p_longitude not between -180 and 180 then raise exception 'Invalid delivery location'; end if;
  select business_latitude, business_longitude into v_hub_lat, v_hub_lng from public.store_settings where id = true;
  v_cos := sin(radians(v_hub_lat)) * sin(radians(p_latitude)) + cos(radians(v_hub_lat)) * cos(radians(p_latitude)) * cos(radians(p_longitude - v_hub_lng));
  return round((6371 * acos(least(1, greatest(-1, v_cos))))::numeric, 2);
end;
$$;

create or replace function public.calculate_delivery_fee(distance_km numeric)
returns numeric language plpgsql stable security definer set search_path = public, pg_temp as $$
declare v_rate numeric; v_unit numeric; v_multiplier numeric;
begin
  if distance_km is null or distance_km < 0 then raise exception 'Invalid delivery distance'; end if;
  select delivery_rate, delivery_distance_unit, distance_multiplier into v_rate, v_unit, v_multiplier from public.store_settings where id = true;
  return round(greatest(10, ceil(distance_km / v_unit) * v_rate) * v_multiplier, 2);
end;
$$;
grant execute on function public.calculate_distance_km(numeric, numeric) to anon, authenticated;
grant execute on function public.calculate_delivery_fee(numeric) to anon, authenticated;

create or replace function public.generate_order_number()
returns text language sql volatile set search_path = public, pg_temp as $$
  select 'JT-' || upper(substr(token, 1, 8)) || '-' || upper(substr(token, 9, 8))
  from (select replace(gen_random_uuid()::text, '-', '') as token) generated;
$$;

create or replace function public.create_order_with_momo(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_delivery_address text,
  p_latitude numeric,
  p_longitude numeric,
  p_payment_method text,
  p_items jsonb,
  p_whatsapp_number text,
  p_delivery_instructions text,
  p_delivery_region text,
  p_notes text,
  p_momo_number text,
  p_momo_network text
)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_method text := lower(btrim(coalesce(p_payment_method, '')));
  v_settings public.store_settings%rowtype;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id uuid;
  v_quantity integer;
  v_seen uuid[] := '{}'::uuid[];
  v_subtotal numeric(12,2) := 0;
  v_distance numeric(10,2);
  v_delivery numeric(12,2);
  v_total numeric(12,2);
  v_order_id uuid := gen_random_uuid();
  v_order_number text := public.generate_order_number();
  v_reference text := 'JT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 24));
  v_currency text;
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Not authorized' using errcode = '42501'; end if;
  if v_method <> 'moolre' then raise exception 'Invalid payment method'; end if;
  select * into v_settings from public.store_settings where id = true;
  if not found or not v_settings.store_open or v_settings.maintenance_mode then raise exception 'The store is currently closed and cannot accept orders'; end if;
  if not v_settings.moolre_enabled then raise exception 'Online payment is currently unavailable'; end if;
  if char_length(btrim(coalesce(p_customer_name, ''))) not between 2 and 120 then raise exception 'Please enter a valid name'; end if;
  if lower(btrim(coalesce(p_customer_email, ''))) !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'Please enter a valid email address'; end if;
  if char_length(regexp_replace(coalesce(p_customer_phone, ''), '[^0-9]', '', 'g')) not between 9 and 15 then raise exception 'Please enter a valid phone number'; end if;
  if char_length(btrim(coalesce(p_delivery_address, ''))) not between 5 and 500 or char_length(btrim(coalesce(p_delivery_region, ''))) = 0 then raise exception 'Please enter a valid delivery address'; end if;
  if p_latitude is null or p_longitude is null or p_latitude not between -90 and 90 or p_longitude not between -180 and 180 then raise exception 'Select a valid delivery location on the map'; end if;
  if char_length(regexp_replace(coalesce(p_momo_number, ''), '[^0-9]', '', 'g')) not between 9 and 15 or char_length(coalesce(p_momo_number, '')) > 30 or coalesce(p_momo_number, '') !~ '^[+0-9() -]+$' then raise exception 'Please enter a valid Mobile Money number'; end if;
  if coalesce(p_momo_network, '') not in ('MTN', 'Telecel', 'AirtelTigo') then raise exception 'Please select a valid Mobile Money network'; end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then raise exception 'Your cart is empty or invalid'; end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then raise exception 'Your cart is empty or invalid'; end if;

  for v_item in select value from jsonb_array_elements(p_items) loop
    begin
      v_product_id := (v_item->>'product_id')::uuid;
      v_quantity := (v_item->>'quantity')::integer;
    exception when others then raise exception 'Invalid cart item'; end;
    if v_quantity not between 1 and 100 or v_product_id = any(v_seen) then raise exception 'Invalid cart item'; end if;
    v_seen := array_append(v_seen, v_product_id);
    select * into v_product from public.products where id = v_product_id and active for update;
    if not found then raise exception 'One or more products are no longer available'; end if;
    if v_product.stock_quantity < v_quantity then raise exception 'Insufficient stock for %', v_product.name; end if;
    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  v_distance := public.calculate_distance_km(p_latitude, p_longitude);
  if v_settings.max_delivery_distance_km is not null and v_distance > v_settings.max_delivery_distance_km then raise exception 'Sorry, this address is outside our delivery range'; end if;
  v_delivery := public.calculate_delivery_fee(v_distance);
  v_total := v_subtotal + v_delivery;
  v_currency := v_settings.currency;

  insert into public.orders (
    id, order_number, customer_name, customer_email, customer_phone, whatsapp_number,
    delivery_address, delivery_region, delivery_instructions, delivery_latitude,
    delivery_longitude, distance_km, subtotal, delivery_fee, total, currency,
    payment_method, payment_status, order_status, momo_number, momo_network,
    moolre_reference, admin_notes
  ) values (
    v_order_id, v_order_number, btrim(p_customer_name), lower(btrim(p_customer_email)), btrim(p_customer_phone), nullif(btrim(coalesce(p_whatsapp_number, '')), ''),
    btrim(p_delivery_address), btrim(p_delivery_region), nullif(btrim(coalesce(p_delivery_instructions, '')), ''),
    p_latitude, p_longitude, v_distance, v_subtotal, v_delivery, v_total, v_currency,
    'moolre', 'pending', 'pending', btrim(p_momo_number), p_momo_network, v_reference, nullif(btrim(coalesce(p_notes, '')), '')
  );

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    select * into v_product from public.products where id = v_product_id;
    insert into public.order_items (order_id, product_id, product_name_snapshot, product_price_snapshot, quantity, line_total)
    values (v_order_id, v_product_id, v_product.name, v_product.price, v_quantity, round(v_product.price * v_quantity, 2));
  end loop;

  return jsonb_build_object('order_id', v_order_id, 'order_number', v_order_number, 'subtotal', v_subtotal, 'delivery_fee', v_delivery, 'total', v_total, 'currency', v_currency, 'payment_method', 'moolre', 'moolre_reference', v_reference, 'distance_km', v_distance);
end;
$$;
revoke all on function public.create_order_with_momo(text,text,text,text,numeric,numeric,text,jsonb,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.create_order_with_momo(text,text,text,text,numeric,numeric,text,jsonb,text,text,text,text,text,text) to service_role;

create or replace function public.confirm_moolre_order(
  p_reference text, p_amount numeric, p_currency text, p_gateway_status text,
  p_transaction_id text default null, p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_order public.orders%rowtype; v_metadata jsonb; v_updated integer; v_items integer;
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Not authorized' using errcode = '42501'; end if;
  if coalesce(btrim(p_gateway_status), '') <> '1' then raise exception 'Moolre has not confirmed a successful payment'; end if;
  select * into v_order from public.orders where moolre_reference = btrim(p_reference) for update;
  if not found or v_order.payment_method <> 'moolre' then raise exception 'Unknown Moolre payment reference'; end if;
  if v_order.payment_status = 'paid' then return jsonb_build_object('ok', true, 'already_confirmed', true, 'order_id', v_order.id, 'order_number', v_order.order_number); end if;
  if v_order.order_status = 'cancelled' then return jsonb_build_object('ok', false, 'reason', 'order_cancelled'); end if;
  if round(coalesce(p_amount, 0), 2) <> round(v_order.total, 2) or upper(coalesce(p_currency, '')) <> v_order.currency then raise exception 'Moolre payment amount or currency does not match the order'; end if;
  if exists (select 1 from public.order_items where order_id = v_order.id and product_id is null) then raise exception 'A product in the paid order is no longer available'; end if;
  if exists (
    select 1 from public.order_items oi join public.products p on p.id = oi.product_id
    where oi.order_id = v_order.id and p.stock_quantity < oi.quantity
  ) then raise exception 'Insufficient stock to confirm the paid order'; end if;
  update public.products p set stock_quantity = p.stock_quantity - oi.quantity, updated_at = now()
  from public.order_items oi where oi.order_id = v_order.id and p.id = oi.product_id and p.stock_quantity >= oi.quantity;
  get diagnostics v_updated = row_count;
  select count(*) into v_items from public.order_items where order_id = v_order.id;
  if v_updated <> v_items then raise exception 'Insufficient stock to confirm the paid order'; end if;
  v_metadata := case when jsonb_typeof(p_metadata) = 'object' then p_metadata else '{}'::jsonb end;
  update public.orders set payment_status = 'paid', order_status = 'confirmed', paid_at = now(), amount_paid = v_order.total,
    moolre_transaction_id = nullif(btrim(coalesce(p_transaction_id, '')), ''),
    payment_metadata = v_metadata || jsonb_build_object('gateway_status', coalesce(p_gateway_status, 'confirmed')),
    updated_at = now()
  where id = v_order.id;
  return jsonb_build_object('ok', true, 'order_id', v_order.id, 'order_number', v_order.order_number);
end;
$$;
revoke all on function public.confirm_moolre_order(text,numeric,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.confirm_moolre_order(text,numeric,text,text,text,jsonb) to service_role;

create or replace function public.update_staff_order_status(p_order_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_order public.orders%rowtype;
begin
  if not (public.is_admin() or public.is_assistant()) then raise exception 'Not authorized' using errcode = '42501'; end if;
  if p_status not in ('pending', 'confirmed', 'processing', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') then raise exception 'Invalid order status'; end if;
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if p_status not in ('pending', 'cancelled') and v_order.payment_status <> 'paid' then raise exception 'Verify Moolre payment before advancing this order'; end if;
  update public.orders set order_status = p_status, updated_at = now() where id = p_order_id;
  return jsonb_build_object('ok', true, 'status', p_status, 'updated_at', now());
end;
$$;
revoke all on function public.update_staff_order_status(uuid,text) from public, anon;
grant execute on function public.update_staff_order_status(uuid,text) to authenticated;

create or replace function public.track_order(p_order_number text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_key text := upper(btrim(coalesce(p_order_number, ''))); v_order public.orders%rowtype; v_failures integer;
begin
  if v_key !~ '^JT-([0-9A-F]{5}-[0-9A-F]{5}|[0-9A-F]{8}-[0-9A-F]{8})$' then return null; end if;
  select failures into v_failures from public.track_order_attempts where order_key = v_key and window_started_at > now() - interval '15 minutes';
  if coalesce(v_failures, 0) >= 8 then raise exception 'Too many attempts. Please wait a few minutes and try again.'; end if;
  select * into v_order from public.orders where order_number = v_key;
  if not found then
    insert into public.track_order_attempts (order_key, window_started_at, failures) values (v_key, now(), 1)
    on conflict (order_key) do update set failures = case when public.track_order_attempts.window_started_at < now() - interval '15 minutes' then 1 else public.track_order_attempts.failures + 1 end, window_started_at = case when public.track_order_attempts.window_started_at < now() - interval '15 minutes' then now() else public.track_order_attempts.window_started_at end;
    return null;
  end if;
  delete from public.track_order_attempts where order_key = v_key;
  return jsonb_build_object('order_number', v_order.order_number, 'order_status', v_order.order_status, 'created_at', v_order.created_at, 'delivery_region', v_order.delivery_region);
end;
$$;
revoke all on function public.track_order(text) from public, anon, authenticated;
grant execute on function public.track_order(text) to service_role;

create or replace function public.consume_customer_order_lookup(p_keys text[], p_max_attempts integer default 5, p_window_seconds integer default 900)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_key text; v_times timestamptz[]; v_now timestamptz := now(); v_window interval := make_interval(secs => greatest(60, least(p_window_seconds, 3600)));
begin
  if auth.role() is distinct from 'service_role' then raise exception 'Not authorized' using errcode = '42501'; end if;
  foreach v_key in array coalesce(p_keys, '{}'::text[]) loop
    perform pg_advisory_xact_lock(hashtextextended(v_key, 0));
    select coalesce(array_agg(u.stamp), '{}'::timestamptz[]) into v_times from unnest((select attempted_at from public.customer_order_lookup_attempts where key_hash = v_key)) as u(stamp) where u.stamp > v_now - v_window;
    if cardinality(v_times) >= greatest(1, p_max_attempts) then return false; end if;
    insert into public.customer_order_lookup_attempts (key_hash, attempted_at) values (v_key, array[v_now])
    on conflict (key_hash) do update set attempted_at = array_append(v_times, v_now);
  end loop;
  return true;
end;
$$;
revoke all on function public.consume_customer_order_lookup(text[],integer,integer) from public, anon, authenticated;
grant execute on function public.consume_customer_order_lookup(text[],integer,integer) to service_role;

create index if not exists guest_order_access_tokens_email_idx on public.guest_order_access_tokens (email, expires_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists jt_product_images_public_read on storage.objects;
create policy jt_product_images_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'product-images');
drop policy if exists jt_product_images_admin_insert on storage.objects;
create policy jt_product_images_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists jt_product_images_admin_update on storage.objects;
create policy jt_product_images_admin_update on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_admin()) with check (bucket_id = 'product-images' and public.is_admin());
drop policy if exists jt_product_images_admin_delete on storage.objects;
create policy jt_product_images_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin alter publication supabase_realtime add table public.orders; exception when duplicate_object then null; end;
    begin alter publication supabase_realtime add table public.products; exception when duplicate_object then null; end;
  end if;
end $$;
