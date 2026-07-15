import { cache } from "react";
import { createClient } from "./server";

export type CurrentProfile = {
  id: string;
  role: "admin" | "sale";
  fullName: string | null;
};

/**
 * Server-side helper: current logged-in user's app role + name, or null if not logged in.
 * Wrapped in React.cache() vì layout.tsx VÀ mỗi page.tsx đều tự gọi hàm này —
 * cache() dedupe theo request, nên trong 1 lần render chỉ thực sự chạy
 * auth.getUser() + query user_profiles MỘT LẦN thay vì 2 lần round-trip Supabase.
 */
export const getCurrentProfile = cache(async (): Promise<CurrentProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { id: profile.id, role: profile.role, fullName: profile.full_name };
});
