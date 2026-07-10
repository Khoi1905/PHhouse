import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NavBar } from "@/components/layout/NavBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <NavBar profile={profile} />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
