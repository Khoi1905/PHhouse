"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildingStepSchema, unitStepSchema, type WizardFormValues } from "@/lib/validation";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateUnitQuickFields(
  unitId: string,
  buildingId: string,
  values: { priceMonth: number; status: string; gdriveFolderLink: string }
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("units")
    .update({
      price_month: values.priceMonth,
      status: values.status as WizardFormValues["status"],
      gdrive_folder_link: values.gdriveFolderLink || null,
    })
    .eq("id", unitId);

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}

export async function updateUnitFull(
  unitId: string,
  buildingId: string,
  values: WizardFormValues
): Promise<ActionResult> {
  const parsed = unitStepSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("units")
    .update({
      room_number: v.roomNumber,
      unit_type: v.unitTypes,
      price_month: v.priceMonth,
      status: v.status,
      details_text: v.detailsText || null,
      gdrive_folder_link: v.gdriveFolderLink || null,
      note: v.unitNote || null,
    })
    .eq("id", unitId);

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}

export async function deleteUnitAction(unitId: string, buildingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("units").delete().eq("id", unitId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/buildings/${buildingId}`);
  return { ok: true };
}

export async function updateBuildingAction(
  buildingId: string,
  values: WizardFormValues
): Promise<ActionResult> {
  const parsed = buildingStepSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("buildings")
    .update({
      district: v.district,
      ward: v.ward || null,
      alley: v.alley || null,
      house_number: v.houseNumber || null,
      guide_name: v.guideName || null,
      guide_phone: v.guidePhone || null,
      access_type: v.accessType || null,
      note: v.buildingNote || null,
    })
    .eq("id", buildingId);

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/buildings/${buildingId}`);
  revalidatePath("/buildings");
  return { ok: true };
}

export async function deleteBuildingAction(buildingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("buildings").delete().eq("id", buildingId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/buildings");
  return { ok: true };
}
