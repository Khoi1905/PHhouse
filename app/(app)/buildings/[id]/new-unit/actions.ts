"use server";

import { createClient } from "@/lib/supabase/server";
import { unitStepSchema, type WizardFormValues } from "@/lib/validation";

export type CreateUnitResult = { ok: true } | { ok: false; error: string };

export async function createUnit(buildingId: string, values: WizardFormValues): Promise<CreateUnitResult> {
  const parsed = unitStepSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Dữ liệu không hợp lệ, vui lòng kiểm tra lại." };
  }
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("units").insert({
    building_id: buildingId,
    room_number: v.roomNumber,
    unit_type: v.unitTypes,
    price_month: v.priceMonth,
    status: v.status,
    details_text: v.detailsText || null,
    gdrive_folder_link: v.gdriveFolderLink || null,
    note: v.unitNote || null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
