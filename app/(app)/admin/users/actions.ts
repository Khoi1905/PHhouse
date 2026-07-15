"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { createUserSchema, type CreateUserValues } from "@/lib/validation";
import { z } from "zod";

type ActionResult = { ok: true } | { ok: false; error: string };

const toggleUserSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean(),
});

// Check tường minh ngay trong action — không chỉ dựa vào middleware chặn
// /admin/*, vì service_role bỏ qua RLS nên phải tự canh ở đây (giống cách
// create_full_entry tự kiểm tra auth_role() dù RLS cũng đã chặn sẵn). Trả về
// null thay vì throw, để nơi gọi trả {ok:false} nhất quán với các action khác.
async function requireAdmin() {
  const profile = await getCurrentProfile();
  return profile?.role === "admin" ? profile : null;
}

export async function createUserAction(values: CreateUserValues): Promise<ActionResult> {
  const caller = await requireAdmin();
  if (!caller) return { ok: false, error: "Không có quyền thực hiện." };

  const parsed = createUserSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };
  }
  const { email, password, fullName, role } = parsed.data;

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "Hệ thống chưa cấu hình Supabase service role." };
  }

  // email_confirm: true — bỏ qua hoàn toàn bước xác thực email, admin nhập
  // xong là tài khoản dùng được ngay.
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    const message = error?.message.includes("already been registered")
      ? "Email này đã có tài khoản."
      : error?.message ?? "Không tạo được tài khoản.";
    return { ok: false, error: message };
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("user_profiles")
    .insert({ id: data.user.id, role, full_name: fullName, is_active: true });

  if (profileError) {
    // Insert user_profiles lỗi -> xóa lại auth user vừa tạo, tránh để lại
    // tài khoản "mồ côi" (đăng nhập được nhưng không có role/profile).
    const { error: cleanupError } = await admin.auth.admin.deleteUser(data.user.id);
    if (cleanupError) {
      return {
        ok: false,
        error: "Không tạo được hồ sơ và không thể dọn tài khoản chưa hoàn tất. Vui lòng kiểm tra Supabase.",
      };
    }
    return { ok: false, error: profileError.message };
  }

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<ActionResult> {
  const caller = await requireAdmin();
  if (!caller) return { ok: false, error: "Không có quyền thực hiện." };

  const parsed = toggleUserSchema.safeParse({ userId, isActive });
  if (!parsed.success) return { ok: false, error: "Dữ liệu tài khoản không hợp lệ." };

  if (parsed.data.userId === caller.id) {
    return { ok: false, error: "Không thể tự khóa tài khoản của chính mình." };
  }

  const supabase = await createClient();
  const { data: updated, error } = await supabase
    .from("user_profiles")
    .update({ is_active: parsed.data.isActive })
    .eq("id", parsed.data.userId)
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!updated) return { ok: false, error: "Không tìm thấy tài khoản cần cập nhật." };
  revalidatePath("/admin/users");
  return { ok: true };
}
