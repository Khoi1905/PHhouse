import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NewUnitForm } from "@/components/forms/NewUnitForm";

export default async function NewUnitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/buildings");

  const supabase = await createClient();
  const { data: building } = await supabase
    .from("buildings")
    .select("district, ward, alley")
    .eq("id", id)
    .single();

  if (!building) notFound();

  const label = [building.district, building.ward, building.alley].filter(Boolean).join(", ");

  return <NewUnitForm buildingId={id} buildingLabel={label} />;
}
