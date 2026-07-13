import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { OwnerInfoCard } from "@/components/owners/OwnerInfoCard";
import { BuildingHeader, type BuildingHeaderData } from "@/components/buildings/BuildingHeader";
import { UnitsTable } from "@/components/buildings/UnitsTable";
import type { OwnerRow } from "@/components/owners/OwnersTable";

export default async function OwnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: owner } = await supabase
    .from("owners")
    .select(
      "id, owner_code, full_name, phone, phone_secondary, email, bank_account, id_number, note, commission_sale_pct, commission_total_pct"
    )
    .eq("id", id)
    .single();

  if (!owner) notFound();

  const { data: buildings } = await supabase
    .from("buildings")
    .select("id, district, ward, alley, house_number, guide_name, guide_phone, access_type")
    .eq("owner_id", id)
    .order("district");

  const buildingsWithUnits = await Promise.all(
    (buildings ?? []).map(async (b) => {
      const { data: units } = await supabase
        .from("units")
        .select("id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note")
        .eq("building_id", b.id)
        .order("room_number");
      return { building: b, units: units ?? [] };
    })
  );

  const ownerRow: OwnerRow = { ...owner, building_count: buildingsWithUnits.length };

  return (
    <div>
      <OwnerInfoCard owner={ownerRow} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          Tòa nhà ({buildingsWithUnits.length})
        </h2>
        <Link
          href={`/admin/new-entry?ownerId=${owner.id}&ownerLabel=${encodeURIComponent(
            `${owner.owner_code} — ${owner.full_name}`
          )}`}
          className="inline-flex items-center gap-1.5 rounded-[9px] bg-ink px-4 py-2 text-[13.5px] font-semibold text-paper hover:opacity-90"
        >
          <Plus size={15} /> Thêm tòa nhà mới
        </Link>
      </div>

      {buildingsWithUnits.length === 0 && (
        <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
          Chủ sở hữu này chưa có tòa nhà nào.
        </div>
      )}

      {buildingsWithUnits.map(({ building, units }) => {
        const headerData: BuildingHeaderData = {
          id: building.id,
          district: building.district,
          ward: building.ward,
          alley: building.alley,
          houseNumber: building.house_number,
          guideName: building.guide_name,
          guidePhone: building.guide_phone,
          accessType: building.access_type,
          ownerCode: owner.owner_code,
          ownerName: owner.full_name,
          commissionSalePct: owner.commission_sale_pct,
          commissionTotalPct: owner.commission_total_pct,
        };
        return (
          <div key={building.id} className="mb-8">
            <BuildingHeader data={headerData} isAdmin />
            <UnitsTable buildingId={building.id} units={units} isAdmin />
          </div>
        );
      })}
    </div>
  );
}
