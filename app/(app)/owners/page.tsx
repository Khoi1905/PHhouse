import { createClient } from "@/lib/supabase/server";
import { OwnersTable, type OwnerRow } from "@/components/owners/OwnersTable";

export default async function OwnersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("owners")
    .select(
      "id, owner_code, full_name, phone, phone_secondary, email, bank_account, id_number, note, commission_sale_pct, commission_total_pct, buildings(count)"
    )
    .order("owner_code");

  const owners: OwnerRow[] = (data ?? []).map((o) => {
    const buildingsField = o.buildings as unknown as { count: number }[] | { count: number } | null;
    const building_count = Array.isArray(buildingsField)
      ? buildingsField[0]?.count ?? 0
      : buildingsField?.count ?? 0;
    return {
      id: o.id,
      owner_code: o.owner_code,
      full_name: o.full_name,
      phone: o.phone,
      phone_secondary: o.phone_secondary,
      email: o.email,
      bank_account: o.bank_account,
      id_number: o.id_number,
      note: o.note,
      commission_sale_pct: o.commission_sale_pct,
      commission_total_pct: o.commission_total_pct,
      building_count,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Chủ sở hữu</h1>
        <p className="mt-1 text-sm text-muted-2">{owners.length} chủ sở hữu trong hệ thống</p>
      </div>
      <OwnersTable owners={owners} />
    </div>
  );
}
