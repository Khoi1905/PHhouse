import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { searchBuildings, searchUnits } from "@/lib/queries/buildings";
import { BuildingFilters } from "@/components/buildings/BuildingFilters";
import { BuildingsTable } from "@/components/buildings/BuildingsTable";
import { UnitsSearchTable } from "@/components/buildings/UnitsSearchTable";
import { ViewModeToggle } from "@/components/buildings/ViewModeToggle";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function BuildingsPage({
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
  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;

  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  // Sale luôn xem theo phòng. Admin mặc định theo tòa, đổi được qua ?view=units.
  const mode: "buildings" | "units" = isAdmin ? (sp.view === "units" ? "units" : "buildings") : "units";

  const supabase = await createClient();

  const commonFilters = { districts, ownerCode, keyword, priceMin, priceMax, unitTypes, accessType };

  if (mode === "units") {
    const { rows, count } = await searchUnits(supabase, {
      ...commonFilters,
      page,
      pageSize: PAGE_SIZE,
    });
    const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

    return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Tra cứu phòng</h1>
            <p className="mt-1 text-sm text-muted-2">{count} phòng khớp với bộ lọc hiện tại</p>
          </div>
          {isAdmin && <ViewModeToggle mode={mode} />}
        </div>

        <BuildingFilters />
        <UnitsSearchTable rows={rows} isAdmin={isAdmin} />
        <Pagination page={page} totalPages={totalPages} basePath="/buildings" />
      </div>
    );
  }

  const { rows, count } = await searchBuildings(supabase, {
    ...commonFilters,
    page,
    pageSize: PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Tra cứu tòa nhà</h1>
          <p className="mt-1 text-sm text-muted-2">{count} tòa nhà khớp với bộ lọc hiện tại</p>
        </div>
        {isAdmin && <ViewModeToggle mode={mode} />}
      </div>

      <BuildingFilters />
      <BuildingsTable rows={rows} isAdmin={isAdmin} />
      <Pagination page={page} totalPages={totalPages} basePath="/buildings" />
    </div>
  );
}
