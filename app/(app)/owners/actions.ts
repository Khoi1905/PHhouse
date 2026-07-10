"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ownerEditSchema, type OwnerEditValues } from "@/lib/validation";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateOwnerAction(ownerId: string, values: OwnerEditValues): Promise<ActionResult> {
  const parsed = ownerEditSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Dữ liệu không hợp lệ." };
  const v = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("owners")
    .update({
      owner_code: v.ownerCode,
      full_name: v.fullName,
      phone: v.phone,
      phone_secondary: v.phoneSecondary || null,
      email: v.email || null,
      bank_account: v.bankAccount || null,
      id_number: v.idNumber || null,
      note: v.ownerNote || null,
    })
    .eq("id", ownerId);

  if (error) {
    return {
      ok: false,
      error: error.message.includes("duplicate") ? "Mã chủ sở hữu đã tồn tại." : error.message,
    };
  }
  revalidatePath("/owners");
  revalidatePath(`/owners/${ownerId}`);
  return { ok: true };
}

export async function deleteOwnerAction(ownerId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("owners").delete().eq("id", ownerId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/owners");
  return { ok: true };
}
