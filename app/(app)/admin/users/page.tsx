import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { UsersTable, type UserRow } from "@/components/admin/UsersTable";

export default async function UsersPage() {
  // Defense in depth: service_role bỏ qua RLS, nên trang phải tự xác minh
  // active admin trước khi khởi tạo admin client, không chỉ dựa vào middleware.
  const currentProfile = await getCurrentProfile();
  if (!currentProfile) redirect("/login");
  if (currentProfile.role !== "admin") redirect("/buildings");

  const supabase = await createClient();
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("id, role, full_name, is_active")
    .order("full_name");

  let authUsers: { id: string; email?: string }[] | null = null;
  let authListError: string | null = null;
  try {
    // Email chỉ nằm trong auth.users, không có trong user_profiles -> phải gọi
    // admin API để lấy rồi join theo id ở đây.
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
    authUsers = data?.users ?? null;
    authListError = error?.message ?? null;
  } catch {
    authListError = "Thiếu hoặc sai cấu hình Supabase service role.";
  }

  if (profilesError || authListError || !authUsers) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-ink">Tài khoản người dùng</h1>
        </div>
        <div role="alert" className="rounded-card border border-danger-fg/25 bg-danger-bg p-5 text-sm text-danger-fg">
          Không tải được danh sách tài khoản. Vui lòng kiểm tra cấu hình service role hoặc thử tải lại trang.
        </div>
      </div>
    );
  }

  const emailById = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  const users: UserRow[] = (profiles ?? []).map((p) => ({
    id: p.id,
    email: emailById.get(p.id) ?? "—",
    full_name: p.full_name,
    role: p.role,
    is_active: p.is_active,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Tài khoản người dùng</h1>
        <p className="mt-1 text-sm text-muted-2">{users.length} tài khoản trong hệ thống</p>
      </div>
      <UsersTable users={users} currentUserId={currentProfile.id} />
    </div>
  );
}
