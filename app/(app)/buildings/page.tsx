import { createClient } from "@/lib/supabase/server";
import { searchBuildings } from "@/lib/queries/buildings";
import { BuildingFilters } from "@/components/buildings/BuildingFilters";
import { BuildingsTable } from "@/components/buildings/BuildingsTable";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function BuildingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const district = typeof sp.district === "string" ? sp.district : undefined;
  const ownerCode = typeof sp.ownerCode === "string" ? sp.ownerCode : undefined;
  const keyword = typeof sp.keyword === "string" ? sp.keyword : undefined;
  const priceMin = typeof sp.priceMin === "string" ? Number(sp.priceMin) : undefined;
  const priceMax = typeof sp.priceMax === "string" ? Number(sp.priceMax) : undefined;
  const unitTypes = sp.unitType ? (Array.isArray(sp.unitType) ? sp.unitType : [sp.unitType]) : undefined;
  const page = typeof sp.page === "string" ? Math.max(1, Number(sp.page)) : 1;

  const supabase = await createClient();
  const { rows, count } = await searchBuildings(supabase, {
    district,
    ownerCode,
    keyword,
    priceMin,
    priceMax,
    unitTypes,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Tra cứu tòa nhà</h1>
        <p className="mt-1 text-sm text-muted-2">{count} tòa nhà khớp với bộ lọc hiện tại</p>
      </div>

      <BuildingFilters />
      <BuildingsTable rows={rows} />
      <Pagination page={page} totalPages={totalPages} basePath="/buildings" />
    </div>
  );
}
