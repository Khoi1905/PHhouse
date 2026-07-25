"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { DISTRICTS, UNIT_TYPES, ACCESS_TYPES, UNIT_SORT_OPTIONS } from "@/lib/constants";
import { Button, MultiSelectDropdown } from "@/components/ui";
import { vndToTrieuStr, trieuStrToVnd } from "@/lib/format";

export function BuildingFilters({
  mode,
  basePath = "/buildings",
}: {
  mode?: "buildings" | "units";
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [districts, setDistricts] = useState<string[]>(searchParams.getAll("district"));
  const [ownerCode, setOwnerCode] = useState(searchParams.get("ownerCode") ?? "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [priceMin, setPriceMin] = useState(vndToTrieuStr(searchParams.get("priceMin")));
  const [priceMax, setPriceMax] = useState(vndToTrieuStr(searchParams.get("priceMax")));
  const [unitTypes, setUnitTypes] = useState<string[]>(searchParams.getAll("unitType"));
  const [accessType, setAccessType] = useState(searchParams.get("accessType") ?? "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") ?? "");

  function toggleUnitType(t: string) {
    setUnitTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function apply() {
    const params = new URLSearchParams();
    // Giữ chế độ xem theo tòa/phòng (admin) khi áp dụng bộ lọc.
    const view = searchParams.get("view");
    if (view) params.set("view", view);
    districts.forEach((d) => params.append("district", d));
    if (ownerCode) params.set("ownerCode", ownerCode);
    if (keyword) params.set("keyword", keyword);
    const priceMinVnd = trieuStrToVnd(priceMin);
    const priceMaxVnd = trieuStrToVnd(priceMax);
    if (priceMinVnd) params.set("priceMin", String(priceMinVnd));
    if (priceMaxVnd) params.set("priceMax", String(priceMaxVnd));
    unitTypes.forEach((t) => params.append("unitType", t));
    if (accessType) params.set("accessType", accessType);
    if (mode === "units" && sortBy) params.set("sort", sortBy);
    router.push(`${basePath}?${params.toString()}`);
  }

  function clearAll() {
    setDistricts([]);
    setOwnerCode("");
    setKeyword("");
    setPriceMin("");
    setPriceMax("");
    setUnitTypes([]);
    setAccessType("");
    setSortBy("");
    const view = searchParams.get("view");
    router.push(view ? `${basePath}?view=${view}` : basePath);
  }

  const hasFilters =
    districts.length > 0 ||
    ownerCode ||
    keyword ||
    priceMin ||
    priceMax ||
    unitTypes.length > 0 ||
    accessType ||
    sortBy;

  return (
    <div className="mb-6 rounded-card border-[1.5px] border-line bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Quận / Huyện</label>
          <MultiSelectDropdown options={DISTRICTS} selected={districts} onChange={setDistricts} />
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Mã chủ sở hữu</label>
          <input
            value={ownerCode}
            onChange={(e) => setOwnerCode(e.target.value)}
            placeholder="OW014"
            className="w-full rounded-field border-[1.5px] border-line px-3 py-2.5 text-sm outline-none placeholder:text-placeholder focus:border-moss"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Từ khóa</label>
          <div className="flex items-center gap-2 rounded-field border-[1.5px] border-line px-3 py-2.5 focus-within:border-moss">
            <Search size={14} className="text-muted" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Phường/xã, ngõ, tên chủ..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-placeholder"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Giá từ (triệu đồng)</label>
          <input
            type="number"
            step="0.1"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0"
            className="w-full rounded-field border-[1.5px] border-line px-3 py-2.5 text-sm outline-none placeholder:text-placeholder focus:border-moss"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Giá đến (triệu đồng)</label>
          <input
            type="number"
            step="0.1"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="15"
            className="w-full rounded-field border-[1.5px] border-line px-3 py-2.5 text-sm outline-none placeholder:text-placeholder focus:border-moss"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Loại phòng</label>
          <div className="flex flex-wrap gap-1.5">
            {UNIT_TYPES.map((t) => {
              const active = unitTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleUnitType(t)}
                  className={`rounded-pill border-[1.5px] px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active ? "border-moss bg-moss text-paper" : "border-line text-muted-2"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Thang máy / Thang bộ</label>
          <div className="relative">
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full appearance-none rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
            >
              <option value="">Tất cả</option>
              {ACCESS_TYPES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {mode === "units" && (
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Sắp xếp</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
              >
                <option value="">Mặc định</option>
                {UNIT_SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button type="button" variant="primary" onClick={apply}>
          Áp dụng lọc
        </Button>
        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clearAll}>
            <X size={14} /> Xóa lọc
          </Button>
        )}
      </div>
    </div>
  );
}
