import ExcelJS from "exceljs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/format";

const SHEET_COLUMNS = [
  { header: "Quận/Huyện", key: "district", width: 16 },
  { header: "Phường/Xã", key: "ward", width: 18 },
  { header: "Ngõ/Ngách", key: "alley", width: 24 },
  { header: "Số nhà", key: "houseNumber", width: 12 },
  { header: "Tên người dẫn", key: "guideName", width: 18 },
  { header: "Số dẫn", key: "guidePhone", width: 16 },
  { header: "Thang máy/bộ", key: "accessType", width: 14 },
  { header: "Số phòng", key: "roomNumber", width: 10 },
  { header: "Loại phòng", key: "unitType", width: 12 },
  { header: "Giá thuê/tháng (VNĐ)", key: "price", width: 18 },
  { header: "Tình trạng", key: "status", width: 14 },
  { header: "Thông tin chi tiết", key: "details", width: 40 },
  { header: "Link Drive", key: "gdrive", width: 30 },
  { header: "Ghi chú", key: "note", width: 24 },
  { header: "Hoa hồng cho sale (%)", key: "commissionSale", width: 18 },
  { header: "Hoa hồng tổng (%)", key: "commissionTotal", width: 18 },
];

/**
 * Builds 1 workbook with 1 sheet per owner (owner_code as sheet name).
 * ownerIds === null exports every owner. Returns null if the resulting
 * owner set is empty (nothing to export).
 */
export async function buildOwnersWorkbook(
  supabase: SupabaseClient<Database>,
  ownerIds: string[] | null
) {
  let ownerQuery = supabase
    .from("owners")
    .select("id, owner_code, full_name, commission_sale_pct, commission_total_pct")
    .order("owner_code");
  if (ownerIds) ownerQuery = ownerQuery.in("id", ownerIds);
  const { data: owners } = await ownerQuery;

  if (!owners || owners.length === 0) return null;

  const ids = owners.map((o) => o.id);
  const { data: buildings } = await supabase
    .from("buildings")
    .select("id, owner_id, district, ward, alley, house_number, guide_name, guide_phone, access_type")
    .in("owner_id", ids);

  const buildingIds = (buildings ?? []).map((b) => b.id);
  const { data: units } = await supabase
    .from("units")
    .select(
      "building_id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note"
    )
    .in("building_id", buildingIds)
    .order("room_number");

  const buildingsByOwner = new Map<string, NonNullable<typeof buildings>>();
  for (const b of buildings ?? []) {
    const list = buildingsByOwner.get(b.owner_id) ?? [];
    list.push(b);
    buildingsByOwner.set(b.owner_id, list);
  }
  const unitsByBuilding = new Map<string, NonNullable<typeof units>>();
  for (const u of units ?? []) {
    const list = unitsByBuilding.get(u.building_id) ?? [];
    list.push(u);
    unitsByBuilding.set(u.building_id, list);
  }

  const workbook = new ExcelJS.Workbook();
  const usedSheetNames = new Set<string>();

  for (const owner of owners) {
    const sheet = workbook.addWorksheet(uniqueSheetName(owner.owner_code, usedSheetNames));
    sheet.columns = SHEET_COLUMNS;
    sheet.getRow(1).font = { bold: true };

    for (const b of buildingsByOwner.get(owner.id) ?? []) {
      for (const u of unitsByBuilding.get(b.id) ?? []) {
        sheet.addRow({
          district: b.district,
          ward: b.ward ?? "",
          alley: b.alley ?? "",
          houseNumber: b.house_number ?? "",
          guideName: b.guide_name ?? "",
          guidePhone: b.guide_phone ?? "",
          accessType: b.access_type ?? "",
          roomNumber: u.room_number,
          unitType: u.unit_type,
          price: formatPrice(u.price_month),
          status: u.status,
          details: u.details_text ?? "",
          gdrive: u.gdrive_folder_link ?? "",
          note: u.note ?? "",
          commissionSale: owner.commission_sale_pct ?? "",
          commissionTotal: owner.commission_total_pct ?? "",
        });
      }
    }
  }

  return { workbook, owners };
}

// Excel sheet names: max 31 chars, can't contain \ / ? * [ ] : , must be unique per workbook.
function uniqueSheetName(rawName: string, used: Set<string>): string {
  const base = rawName.replace(/[\\/?*[\]:]/g, "_").slice(0, 31) || "Sheet";
  let candidate = base;
  let i = 2;
  while (used.has(candidate)) {
    const suffix = ` (${i})`;
    candidate = base.slice(0, 31 - suffix.length) + suffix;
    i++;
  }
  used.add(candidate);
  return candidate;
}
