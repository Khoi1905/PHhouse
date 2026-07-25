"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

const labelSchema = z.string().trim().min(1, "Tên không được để trống").max(60, "Tên tối đa 60 ký tự");

// Đổi tên hiển thị của "Top phòng" (vd "Phòng hot") — không đụng tới danh
// sách phòng bên trong. Dựa RLS admin_update_app_settings, không cần check
// role tường minh ở đây (giống pinUnitAction).
export async function updateTopLabelAction(label: string): Promise<ActionResult> {
  const parsed = labelSchema.safeParse(label);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Tên không hợp lệ." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("app_settings")
    .update({ value: parsed.data })
    .eq("key", "top_units_label");

  if (error) return { ok: false, error: error.message };
  revalidatePath("/top");
  revalidatePath("/", "layout");
  return { ok: true };
}
