"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

// Ghim/bỏ ghim cả tòa — cascade sang các phòng còn trống của tòa đó, xử lý
// trong 1 transaction ở RPC set_building_pin (admin-only, RLS + check kép).
export async function pinBuildingAction(buildingId: string, pin: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_building_pin", {
    p_building_id: buildingId,
    p_pin: pin,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/buildings");
  revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}

// Ghim/bỏ ghim 1 phòng riêng lẻ — không cascade, chỉ đổi units.pinned_at.
// buildingId chỉ dùng để revalidate trang chi tiết tòa khi gọi từ đó (UnitsTable) —
// bỏ trống khi gọi từ view tìm kiếm theo phòng (UnitsSearchTable), nơi không cần.
export async function pinUnitAction(
  unitId: string,
  pin: boolean,
  buildingId?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("units")
    .update({ pinned_at: pin ? new Date().toISOString() : null })
    .eq("id", unitId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/buildings");
  if (buildingId) revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}

// Thêm/bỏ 1 phòng khỏi danh sách "Top phòng" — độc lập hoàn toàn với ghim,
// không cascade theo tòa. Cùng cơ chế bảo mật như pinUnitAction (dựa RLS
// admin_full_access_units, không cần check role tường minh ở đây).
export async function toggleUnitTopAction(
  unitId: string,
  isTop: boolean,
  buildingId?: string
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("units")
    .update({ top_added_at: isTop ? new Date().toISOString() : null })
    .eq("id", unitId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/buildings");
  revalidatePath("/top");
  if (buildingId) revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}
