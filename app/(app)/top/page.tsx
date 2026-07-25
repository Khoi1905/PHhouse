import { getCurrentProfile } from "@/lib/supabase/profile";
import { getTopUnitsLabel } from "@/lib/supabase/settings";
import { createClient } from "@/lib/supabase/server";
import { searchUnits } from "@/lib/queries/buildings";
import { BuildingFilters } from "@/components/buildings/BuildingFilters";
import { UnitsSearchTable } from "@/components/buildings/UnitsSearchTable";
import { TopLabelEditor } from "@/components/top/TopLabelEditor";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function TopUnitsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const districts = sp.district ? (Array.isArray(sp.district) ? sp.district : [sp.district]) : undefined;
  const ownerCode = typeof sp.ownerCode === "string" ? sp.ownerCode : undefined;
  const keyword = typeof sp.keyword === "string" ? sp.keyword : undefined;
  const priceMin = typeof sp.priceMin === "string" ? Number(sp.priceMin) : undefined;
  const priceMax = typeof sp.priceMax === "string" ? Number(sp.priceMax) : undefined;
  const unitTypes = sp.unitType ? (Array.isArray(sp.unitType) ? sp.unitType : [sp.unitType]) : undefined;
  const accessType = typeof sp.accessType === "string" ? sp.accessType : undefined;
  const sortBy = typeof sp.sort === "string" ? sp.sort : undefined;
  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;

  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";
  const label = await getTopUnitsLabel();

  const supabase = await createClient();
  const { rows, count } = await searchUnits(supabase, {
    districts,
    ownerCode,
    keyword,
    priceMin,
    priceMax,
    unitTypes,
    accessType,
    sortBy,
    topOnly: true,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
            {isAdmin && <TopLabelEditor currentLabel={label} />}
          </div>
          <p className="mt-1 text-sm text-muted-2">{count} phòng trong danh sách</p>
        </div>
      </div>

      <BuildingFilters mode="units" basePath="/top" />
      <UnitsSearchTable rows={rows} isAdmin={isAdmin} />
      <Pagination page={page} totalPages={totalPages} basePath="/top" />
    </div>
  );
}
