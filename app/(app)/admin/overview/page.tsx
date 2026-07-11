import { createClient } from "@/lib/supabase/server";
import { OverviewSheet, type OwnerSheet } from "@/components/admin/OverviewSheet";
import type { UnitStatus } from "@/lib/constants";

type RawUnit = {
  id: string;
  room_number: string;
  unit_type: string;
  price_month: number;
  status: UnitStatus;
  details_text: string | null;
  gdrive_folder_link: string | null;
  note: string | null;
};

type RawBuilding = {
  id: string;
  district: string;
  ward: string | null;
  alley: string | null;
  house_number: string | null;
  guide_name: string | null;
  guide_phone: string | null;
  units: RawUnit[];
};

type RawOwner = {
  id: string;
  owner_code: string;
  full_name: string;
  commission_sale_pct: number | null;
  commission_total_pct: number | null;
  buildings: RawBuilding[];
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("owners")
    .select(
      `id, owner_code, full_name, commission_sale_pct, commission_total_pct,
       buildings ( id, district, ward, alley, house_number, guide_name, guide_phone,
         units ( id, room_number, unit_type, price_month, status, details_text, gdrive_folder_link, note ) )`
    )
    .order("owner_code")
    .returns<RawOwner[]>();

  const sheets: OwnerSheet[] = (data ?? []).map((o) => ({
    id: o.id,
    ownerCode: o.owner_code,
    fullName: o.full_name,
    commissionSalePct: o.commission_sale_pct,
    commissionTotalPct: o.commission_total_pct,
    rows: (o.buildings ?? []).flatMap((b) =>
      (b.units ?? []).map((u) => ({
        buildingId: b.id,
        district: b.district,
        ward: b.ward,
        alley: b.alley,
        houseNumber: b.house_number,
        guideName: b.guide_name,
        guidePhone: b.guide_phone,
        unitId: u.id,
        roomNumber: u.room_number,
        unitType: u.unit_type,
        priceMonth: u.price_month,
        status: u.status,
        detailsText: u.details_text,
        gdriveLink: u.gdrive_folder_link,
        note: u.note,
      }))
    ),
  }));

  return <OverviewSheet sheets={sheets} />;
}
