import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client dùng service_role key — BỎ QUA TOÀN BỘ RLS.
 *
 * CHỈ được gọi bên trong Server Component / Server Action, KHÔNG BAO GIỜ import vào Client
 * Component (import "server-only" ở trên sẽ làm build lỗi ngay nếu ai đó
 * lỡ import file này vào code chạy ở trình duyệt). Hiện chỉ dùng cho các
 * thao tác `auth.admin.*` (liệt kê/tạo/xóa Auth user) — không dùng để query bảng
 * dữ liệu thường, những chỗ đó vẫn phải qua client thường (lib/supabase/server.ts)
 * để RLS tiếp tục là lớp phòng thủ chính.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Thiếu SUPABASE_SERVICE_ROLE_KEY hoặc NEXT_PUBLIC_SUPABASE_URL trong .env.local"
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
