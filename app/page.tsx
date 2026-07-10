import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function RootPage() {
  const profile = await getCurrentProfile();
  redirect(profile ? "/buildings" : "/login");
}
