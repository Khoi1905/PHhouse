-- ============================================================================
-- CHDV — Schema, RLS, triggers, seed
-- Paste this whole file into Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists unaccent;   -- diacritic-insensitive search (Cầu Giấy ~ cau giay)

-- ----------------------------------------------------------------------------
-- 1. Tables
-- ----------------------------------------------------------------------------

create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  owner_code text unique not null,
  full_name text not null,
  phone text not null,
  phone_secondary text,
  email text,
  id_number text,
  bank_account text,
  note text,
  -- % hoa hồng. commission_sale_pct: public, sale xem được (qua buildings_sale_view).
  -- commission_total_pct: chỉ admin xem, không lộ qua bất kỳ view/RPC nào cho sale.
  commission_sale_pct numeric check (commission_sale_pct is null or (commission_sale_pct >= 0 and commission_sale_pct <= 100)),
  commission_total_pct numeric check (commission_total_pct is null or (commission_total_pct >= 0 and commission_total_pct <= 100)),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 30 đơn vị hành chính cấp quận/huyện của Hà Nội (12 quận nội thành + 17 huyện + 1 thị xã).
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id) on delete cascade not null,
  district text not null check (district in (
    'Ba Đình','Hoàn Kiếm','Hai Bà Trưng','Đống Đa','Tây Hồ','Cầu Giấy',
    'Thanh Xuân','Hoàng Mai','Long Biên','Hà Đông','Nam Từ Liêm','Bắc Từ Liêm',
    'Sóc Sơn','Đông Anh','Gia Lâm','Thanh Trì','Ba Vì','Chương Mỹ','Đan Phượng',
    'Hoài Đức','Mỹ Đức','Phú Xuyên','Phúc Thọ','Quốc Oai','Thạch Thất',
    'Thanh Oai','Thường Tín','Ứng Hòa','Mê Linh','Sơn Tây'
  )),
  ward text,
  alley text,
  house_number text,
  -- Người dẫn sale đi xem phòng trực tiếp. Nhạy cảm như house_number — chỉ
  -- admin xem, không lộ qua buildings_sale_view.
  guide_name text,
  guide_phone text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists units (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id) on delete cascade not null,
  room_number text not null,
  unit_type text not null check (unit_type in ('Studio','1N1K','2N1K','Gác xép','Giường tầng','Đơn-VSC')),
  price_month numeric not null,
  status text not null default 'Trống' check (status in ('Trống','Full','Giữa tháng trống','Cuối tháng trống')),
  details_text text,
  gdrive_folder_link text,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists unit_history (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units(id) on delete cascade not null,
  changed_by uuid references auth.users(id) on delete set null,
  field_name text not null check (field_name in ('price_month','status')),
  old_value text,
  new_value text,
  changed_at timestamptz default now()
);

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','sale')),
  full_name text,
  is_active boolean default true
);

create index if not exists idx_buildings_owner_id on buildings(owner_id);
create index if not exists idx_buildings_district on buildings(district);
create index if not exists idx_units_building_id on units(building_id);
create index if not exists idx_units_status on units(status);
create index if not exists idx_units_unit_type on units(unit_type);
create index if not exists idx_unit_history_unit_id on unit_history(unit_id);

-- ----------------------------------------------------------------------------
-- 2. updated_at auto-touch trigger (owners, buildings, units)
-- ----------------------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_owners_updated_at on owners;
create trigger trg_owners_updated_at before update on owners
  for each row execute function set_updated_at();

drop trigger if exists trg_buildings_updated_at on buildings;
create trigger trg_buildings_updated_at before update on buildings
  for each row execute function set_updated_at();

drop trigger if exists trg_units_updated_at on units;
create trigger trg_units_updated_at before update on units
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Audit log trigger — units.price_month / units.status only
-- ----------------------------------------------------------------------------
create or replace function log_unit_changes() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.price_month is distinct from old.price_month then
    insert into unit_history (unit_id, changed_by, field_name, old_value, new_value)
    values (new.id, auth.uid(), 'price_month', old.price_month::text, new.price_month::text);
  end if;
  if new.status is distinct from old.status then
    insert into unit_history (unit_id, changed_by, field_name, old_value, new_value)
    values (new.id, auth.uid(), 'status', old.status, new.status);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_log_unit_changes on units;
create trigger trg_log_unit_changes
  after update on units
  for each row execute function log_unit_changes();

-- ----------------------------------------------------------------------------
-- 4. Role helper — reads app-level role from user_profiles.
--    SECURITY DEFINER so it can read user_profiles without triggering RLS
--    recursion, and so is_active=false silently revokes all access.
-- ----------------------------------------------------------------------------
create or replace function auth_role() returns text
language sql stable
security definer
set search_path = public
as $$
  select role from user_profiles where id = auth.uid() and is_active = true;
$$;

-- ----------------------------------------------------------------------------
-- 5. Row Level Security
-- ----------------------------------------------------------------------------
alter table owners enable row level security;
alter table buildings enable row level security;
alter table units enable row level security;
alter table unit_history enable row level security;
alter table user_profiles enable row level security;

-- owners: admin only, full access. Sale: no policy => fully denied.
drop policy if exists "admin_full_access_owners" on owners;
create policy "admin_full_access_owners" on owners
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- buildings: admin only, full access (includes house_number).
-- Sale never gets a policy here — direct queries against this table return
-- zero rows for sale, so house_number cannot leak even via raw REST calls.
-- Sale reads buildings through buildings_sale_view (section 6) instead.
drop policy if exists "admin_full_access_buildings" on buildings;
create policy "admin_full_access_buildings" on buildings
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- units: no sensitive columns, so both roles can read; only admin writes.
drop policy if exists "admin_full_access_units" on units;
create policy "admin_full_access_units" on units
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

drop policy if exists "sale_select_units" on units;
create policy "sale_select_units" on units
  for select using (auth_role() = 'sale');

-- unit_history: admin can read; nobody writes directly (only the
-- SECURITY DEFINER trigger above writes, bypassing RLS as table owner).
drop policy if exists "admin_select_unit_history" on unit_history;
create policy "admin_select_unit_history" on unit_history
  for select using (auth_role() = 'admin');

-- user_profiles: admin manages everyone; anyone can read their own row
-- (the app uses this to know its own role/name after login).
drop policy if exists "admin_full_access_user_profiles" on user_profiles;
create policy "admin_full_access_user_profiles" on user_profiles
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

drop policy if exists "user_select_own_profile" on user_profiles;
create policy "user_select_own_profile" on user_profiles
  for select using (id = auth.uid());

-- ----------------------------------------------------------------------------
-- 6. buildings_sale_view — the approved mechanism for hiding house_number.
--    Created without security_invoker, so it runs with the view owner's
--    privileges (bypassing the admin-only RLS above) while only ever
--    exposing the safe column list below. owner_code and commission_sale_pct
--    are joined in because they're meant to be public to sale, but no other
--    owner field (phone/bank/email/note/commission_total_pct) is exposed.
-- ----------------------------------------------------------------------------
drop view if exists buildings_sale_view;
create view buildings_sale_view
with (security_invoker = false)
as
select
  b.id,
  b.owner_id,
  o.owner_code,
  o.commission_sale_pct,
  b.district,
  b.ward,
  b.alley,
  b.note,
  b.created_at,
  b.updated_at
from buildings b
join owners o on o.id = b.owner_id;

-- ----------------------------------------------------------------------------
-- 7. search_buildings — powers the /buildings filter bar in one round trip:
--    district / owner_code / free-text keyword (accent-insensitive, matches
--    ward, alley, owner full name) / price range / unit types, with
--    match-through semantics (price AND type must both be satisfied by the
--    SAME unit row). house_number is resolved server-side from auth_role()
--    — never trust a client-supplied flag for this.
-- ----------------------------------------------------------------------------
create or replace function search_buildings(
  p_district text default null,
  p_owner_code text default null,
  p_keyword text default null,
  p_price_min numeric default null,
  p_price_max numeric default null,
  p_unit_types text[] default null
)
returns table (
  id uuid,
  district text,
  ward text,
  alley text,
  house_number text,
  owner_id uuid,
  owner_code text,
  total_units bigint,
  vacant_units bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean := (auth_role() = 'admin');
begin
  if auth_role() is null then
    raise exception 'not authorized';
  end if;

  return query
  select
    b.id,
    b.district,
    b.ward,
    b.alley,
    case when v_is_admin then b.house_number else null end as house_number,
    b.owner_id,
    o.owner_code,
    count(u.id) as total_units,
    count(u.id) filter (where u.status in ('Trống','Giữa tháng trống','Cuối tháng trống')) as vacant_units
  from buildings b
  join owners o on o.id = b.owner_id
  left join units u on u.building_id = b.id
  where
    (p_district is null or b.district = p_district)
    and (p_owner_code is null or p_owner_code = '' or o.owner_code ilike '%' || p_owner_code || '%')
    and (
      p_keyword is null or p_keyword = '' or
      unaccent(lower(coalesce(b.ward,''))) ilike '%' || unaccent(lower(p_keyword)) || '%' or
      unaccent(lower(coalesce(b.alley,''))) ilike '%' || unaccent(lower(p_keyword)) || '%' or
      unaccent(lower(o.full_name)) ilike '%' || unaccent(lower(p_keyword)) || '%'
    )
    and (
      (p_price_min is null and p_price_max is null and p_unit_types is null)
      or exists (
        select 1 from units u2
        where u2.building_id = b.id
          and (p_price_min is null or u2.price_month >= p_price_min)
          and (p_price_max is null or u2.price_month <= p_price_max)
          and (p_unit_types is null or u2.unit_type = any(p_unit_types))
      )
    )
  group by b.id, o.owner_code
  order by b.district, b.ward;
end;
$$;

-- ----------------------------------------------------------------------------
-- 8. create_full_entry — powers /admin/new-entry. Wraps owner (new-or-
--    existing) + building + first unit inserts in one transaction so a
--    failure on any step (e.g. duplicate owner_code) rolls back the whole
--    thing instead of leaving an orphaned owner/building behind.
--    SECURITY INVOKER (default) — runs as the calling admin, RLS/grants on
--    owners/buildings/units still apply exactly as if inserted directly.
--
--    Its parameter list has grown a few times as fields were added. Postgres
--    only lets CREATE OR REPLACE FUNCTION swap a function whose signature
--    (arg count/types) is IDENTICAL — a changed signature creates a SEPARATE
--    overload instead of replacing the old one, and then plain statements
--    like `grant execute on function create_full_entry ...` fail with
--    "function name is not unique". So: drop every existing overload of this
--    function name first, unconditionally, before (re)creating the current
--    one. Safe to run any time — DROP FUNCTION never touches table data.
-- ----------------------------------------------------------------------------
do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'create_full_entry'
  loop
    execute format('drop function %s', r.sig);
  end loop;
end $$;

create or replace function create_full_entry(
  p_owner_mode text,
  p_owner_id uuid,
  p_owner_code text,
  p_owner_full_name text,
  p_owner_phone text,
  p_owner_phone_secondary text,
  p_owner_email text,
  p_owner_bank_account text,
  p_owner_note text,
  p_owner_commission_sale_pct numeric,
  p_owner_commission_total_pct numeric,
  p_district text,
  p_ward text,
  p_alley text,
  p_house_number text,
  p_guide_name text,
  p_guide_phone text,
  p_building_note text,
  p_room_number text,
  p_unit_type text,
  p_price_month numeric,
  p_status text,
  p_details_text text,
  p_gdrive_link text,
  p_unit_note text
)
returns table (owner_id uuid, building_id uuid, unit_id uuid)
language plpgsql
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_building_id uuid;
  v_unit_id uuid;
begin
  if auth_role() <> 'admin' then
    raise exception 'not authorized';
  end if;

  if p_owner_mode = 'existing' then
    v_owner_id := p_owner_id;
  else
    insert into owners (owner_code, full_name, phone, phone_secondary, email, bank_account, note,
                         commission_sale_pct, commission_total_pct)
    values (p_owner_code, p_owner_full_name, p_owner_phone, nullif(p_owner_phone_secondary, ''),
            nullif(p_owner_email, ''), nullif(p_owner_bank_account, ''), nullif(p_owner_note, ''),
            p_owner_commission_sale_pct, p_owner_commission_total_pct)
    returning id into v_owner_id;
  end if;

  insert into buildings (owner_id, district, ward, alley, house_number, guide_name, guide_phone, note)
  values (v_owner_id, p_district, nullif(p_ward, ''), nullif(p_alley, ''), nullif(p_house_number, ''),
          nullif(p_guide_name, ''), nullif(p_guide_phone, ''), nullif(p_building_note, ''))
  returning id into v_building_id;

  insert into units (building_id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note)
  values (v_building_id, p_room_number, p_unit_type, p_price_month, p_status,
          nullif(p_details_text, ''), nullif(p_gdrive_link, ''), nullif(p_unit_note, ''))
  returning id into v_unit_id;

  return query select v_owner_id, v_building_id, v_unit_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 9. Grants — table-level privileges; RLS above decides row/column visibility.
-- ----------------------------------------------------------------------------
grant usage on schema public to authenticated;
grant select, insert, update, delete on owners to authenticated;
grant select, insert, update, delete on buildings to authenticated;
grant select, insert, update, delete on units to authenticated;
grant select on unit_history to authenticated;
grant select, insert, update on user_profiles to authenticated;
grant select on buildings_sale_view to authenticated;
grant execute on function search_buildings to authenticated;
grant execute on function auth_role to authenticated;
grant execute on function create_full_entry to authenticated;

-- ============================================================================
-- Migration (2026-07-10): Phường/Xã không còn bắt buộc.
-- Nếu project Supabase của bạn đã chạy schema.sql từ trước (ward đang NOT
-- NULL), chạy riêng lệnh này 1 lần trong SQL Editor để đồng bộ:
-- ============================================================================
alter table buildings alter column ward drop not null;

-- ============================================================================
-- Migration (2026-07-10): đổi danh sách Tình trạng phòng thành
-- 'Trống' / 'Full' / 'Giữa tháng trống' / 'Cuối tháng trống'.
-- Nếu project Supabase của bạn đã chạy schema.sql từ trước, chạy khối này
-- 1 lần trong SQL Editor. PHẢI xóa constraint cũ TRƯỚC khi remap dữ liệu —
-- constraint cũ chưa cho phép giá trị 'Full' nên UPDATE sẽ lỗi nếu chạy
-- trước bước DROP:
--   'Đang thuê'      -> 'Full'  (rõ nghĩa, phòng đang có khách)
--   'Đang sửa chữa'  -> 'Trống' (KHÔNG còn khớp nghĩa — cần tự rà soát lại
--                                 các phòng này sau khi chạy migration)
--   'Ngừng cho thuê' -> 'Trống' (tương tự, cần tự rà soát lại)
-- ============================================================================
alter table units drop constraint if exists units_status_check;

update units set status = 'Full' where status = 'Đang thuê';
update units set status = 'Trống' where status in ('Đang sửa chữa', 'Ngừng cho thuê');

alter table units add constraint units_status_check
  check (status in ('Trống','Full','Giữa tháng trống','Cuối tháng trống'));

-- ============================================================================
-- Migration (2026-07-12): thêm % hoa hồng theo chủ sở hữu.
-- Nếu project Supabase của bạn đã chạy schema.sql từ trước, chạy khối này
-- 1 lần trong SQL Editor để đồng bộ:
-- ============================================================================
alter table owners add column if not exists commission_sale_pct numeric;
alter table owners add column if not exists commission_total_pct numeric;

alter table owners drop constraint if exists owners_commission_sale_pct_check;
alter table owners add constraint owners_commission_sale_pct_check
  check (commission_sale_pct is null or (commission_sale_pct >= 0 and commission_sale_pct <= 100));

alter table owners drop constraint if exists owners_commission_total_pct_check;
alter table owners add constraint owners_commission_total_pct_check
  check (commission_total_pct is null or (commission_total_pct >= 0 and commission_total_pct <= 100));

-- ============================================================================
-- Migration (2026-07-12): thêm loại phòng "Đơn-VSC".
-- Nếu project Supabase của bạn đã chạy schema.sql từ trước, chạy khối này
-- 1 lần trong SQL Editor để đồng bộ. Chỉ THÊM giá trị mới nên không cần remap
-- dữ liệu cũ (khác migration đổi status trước đây).
-- ============================================================================
alter table units drop constraint if exists units_unit_type_check;
alter table units add constraint units_unit_type_check
  check (unit_type in ('Studio','1N1K','2N1K','Gác xép','Giường tầng','Đơn-VSC'));

-- ============================================================================
-- Migration (2026-07-12): thêm "Người dẫn" / "Số dẫn" cho tòa nhà (nhạy cảm
-- như house_number — chỉ admin xem). Nếu project Supabase của bạn đã chạy
-- schema.sql từ trước, chạy khối này 1 lần trong SQL Editor để đồng bộ:
-- ============================================================================
alter table buildings add column if not exists guide_name text;
alter table buildings add column if not exists guide_phone text;

-- ============================================================================
-- Bootstrap: tạo tài khoản admin đầu tiên (một lần, thủ công)
-- ============================================================================
-- 1. Supabase Dashboard → Authentication → Users → Add user (email + password).
-- 2. Copy UUID của user vừa tạo, rồi chạy (thay giá trị thật vào):
--
--    insert into user_profiles (id, role, full_name)
--    values ('00000000-0000-0000-0000-000000000000', 'admin', 'Tên admin');
--
-- Tạo tài khoản sale sau này lặp lại đúng 2 bước trên với role = 'sale'.
-- ============================================================================