import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { getTopUnitsLabel } from "@/lib/supabase/settings";
import { NavBar } from "@/components/layout/NavBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const topUnitsLabel = await getTopUnitsLabel();

  return (
    <div className="min-h-screen bg-paper">
      <NavBar profile={profile} topUnitsLabel={topUnitsLabel} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
