import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { BuildingHeader, type BuildingHeaderData } from "@/components/buildings/BuildingHeader";
import { UnitsTable } from "@/components/buildings/UnitsTable";

export default async function BuildingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) notFound();

  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let headerData: BuildingHeaderData | null = null;

  if (isAdmin) {
    const { data } = await supabase
      .from("buildings")
      .select("id, district, ward, alley, house_number, owner_id, owners(owner_code, full_name)")
      .eq("id", id)
      .single();

    if (data) {
      const owner = Array.isArray(data.owners) ? data.owners[0] : data.owners;
      headerData = {
        id: data.id,
        district: data.district,
        ward: data.ward,
        alley: data.alley,
        houseNumber: data.house_number,
        ownerCode: owner?.owner_code ?? "—",
        ownerName: owner?.full_name,
      };
    }
  } else {
    const { data } = await supabase
      .from("buildings_sale_view")
      .select("id, district, ward, alley, owner_code")
      .eq("id", id)
      .single();

    if (data) {
      headerData = {
        id: data.id,
        district: data.district,
        ward: data.ward,
        alley: data.alley,
        houseNumber: null,
        ownerCode: data.owner_code,
      };
    }
  }

  if (!headerData) notFound();

  const { data: units } = await supabase
    .from("units")
    .select("id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note")
    .eq("building_id", id)
    .order("room_number");

  return (
    <div>
      <BuildingHeader data={headerData} isAdmin={isAdmin} />
      <UnitsTable buildingId={id} units={units ?? []} isAdmin={isAdmin} />
    </div>
  );
}
