"use server";

import { createClient } from "@/lib/supabase/server";
import { fullEntrySchema, type FullEntryFormValues } from "@/lib/validation";

export async function searchOwners(keyword: string) {
  if (!keyword.trim()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("owners")
    .select("id, owner_code, full_name")
    .or(`owner_code.ilike.%${keyword}%,full_name.ilike.%${keyword}%`)
    .order("owner_code")
    .limit(10);

  if (error) return [];
  return data;
}

export type CreateFullEntryResult =
  | { ok: true; buildingId: string }
  | { ok: false; error: string };

export async function createFullEntry(values: FullEntryFormValues): Promise<CreateFullEntryResult> {
  const parsed = fullEntrySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại các bước." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_full_entry", {
    p_owner_mode: v.mode,
    p_owner_id: v.mode === "existing" ? v.ownerId : null,
    p_owner_code: v.mode === "new" ? v.ownerCode : null,
    p_owner_full_name: v.mode === "new" ? v.fullName : null,
    p_owner_phone: v.mode === "new" ? v.phone : null,
    p_owner_phone_secondary: v.mode === "new" ? v.phoneSecondary ?? null : null,
    p_owner_email: v.mode === "new" ? v.email ?? null : null,
    p_owner_bank_account: v.mode === "new" ? v.bankAccount ?? null : null,
    p_owner_note: v.mode === "new" ? v.ownerNote ?? null : null,
    p_district: v.district,
    p_ward: v.ward ?? null,
    p_alley: v.alley ?? null,
    p_house_number: v.houseNumber ?? null,
    p_building_note: v.buildingNote ?? null,
    p_room_number: v.roomNumber,
    p_unit_type: v.unitType,
    p_price_month: v.priceMonth,
    p_status: v.status,
    p_details_text: v.detailsText ?? null,
    p_gdrive_link: v.gdriveFolderLink ?? null,
    p_unit_note: v.unitNote ?? null,
  });

  if (error || !data || data.length === 0) {
    return {
      ok: false,
      error: error?.message.includes("duplicate")
        ? "Mã chủ sở hữu đã tồn tại."
        : error?.message ?? "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }

  return { ok: true, buildingId: data[0].building_id };
}
