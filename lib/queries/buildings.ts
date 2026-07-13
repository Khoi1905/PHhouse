import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type BuildingSearchFilters = {
  districts?: string[];
  ownerCode?: string;
  keyword?: string;
  priceMin?: number;
  priceMax?: number;
  unitTypes?: string[];
  accessType?: string;
  page?: number;
  pageSize?: number;
};

export async function searchBuildings(
  supabase: SupabaseClient<Database>,
  filters: BuildingSearchFilters
) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .rpc(
      "search_buildings",
      {
        p_districts: filters.districts && filters.districts.length > 0 ? filters.districts : null,
        p_owner_code: filters.ownerCode || null,
        p_keyword: filters.keyword || null,
        p_price_min: filters.priceMin ?? null,
        p_price_max: filters.priceMax ?? null,
        p_unit_types: filters.unitTypes && filters.unitTypes.length > 0 ? filters.unitTypes : null,
        p_access_type: filters.accessType || null,
      },
      { count: "exact" }
    )
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return { rows: data ?? [], count: count ?? 0, page, pageSize };
}

export type UnitSearchFilters = {
  districts?: string[];
  ownerCode?: string;
  keyword?: string;
  priceMin?: number;
  priceMax?: number;
  unitTypes?: string[];
  statuses?: string[];
  accessType?: string;
  page?: number;
  pageSize?: number;
};

// View "theo phòng": 1 dòng = 1 phòng. Sale gọi mặc định; admin gọi khi bật
// toggle "xem theo phòng". RPC tự loại phòng Full cho sale ở tầng SQL.
export async function searchUnits(
  supabase: SupabaseClient<Database>,
  filters: UnitSearchFilters
) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = supabase
    .rpc(
      "search_units",
      {
        p_districts: filters.districts && filters.districts.length > 0 ? filters.districts : null,
        p_owner_code: filters.ownerCode || null,
        p_keyword: filters.keyword || null,
        p_price_min: filters.priceMin ?? null,
        p_price_max: filters.priceMax ?? null,
        p_unit_types: filters.unitTypes && filters.unitTypes.length > 0 ? filters.unitTypes : null,
        p_statuses: filters.statuses && filters.statuses.length > 0 ? filters.statuses : null,
        p_access_type: filters.accessType || null,
      },
      { count: "exact" }
    )
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return { rows: data ?? [], count: count ?? 0, page, pageSize };
}
