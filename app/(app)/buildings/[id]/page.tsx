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
      .select(
        "id, district, ward, alley, house_number, guide_name, guide_phone, access_type, pinned_at, owner_id, owners(owner_code, full_name, commission_sale_pct, commission_total_pct)"
      )
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
        guideName: data.guide_name,
        guidePhone: data.guide_phone,
        accessType: data.access_type,
        pinnedAt: data.pinned_at,
        ownerCode: owner?.owner_code ?? "—",
        ownerName: owner?.full_name,
        commissionSalePct: owner?.commission_sale_pct,
        commissionTotalPct: owner?.commission_total_pct,
      };
    }
  } else {
    const { data } = await supabase
      .from("buildings_sale_view")
      .select("id, district, ward, alley, access_type, owner_code, commission_sale_pct")
      .eq("id", id)
      .single();

    if (data) {
      headerData = {
        id: data.id,
        district: data.district,
        ward: data.ward,
        alley: data.alley,
        houseNumber: null,
        accessType: data.access_type,
        ownerCode: data.owner_code,
        commissionSalePct: data.commission_sale_pct,
      };
    }
  }

  if (!headerData) notFound();

  const { data: units } = await supabase
    .from("units")
    .select(
      "id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note, pinned_at, top_added_at"
    )
    .eq("building_id", id)
    .order("room_number");

  return (
    <div>
      <BuildingHeader data={headerData} isAdmin={isAdmin} />
      <UnitsTable buildingId={id} units={units ?? []} isAdmin={isAdmin} />
    </div>
  );
}
