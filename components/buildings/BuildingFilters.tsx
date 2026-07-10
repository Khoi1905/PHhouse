"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { DISTRICTS, UNIT_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui";

export function BuildingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [district, setDistrict] = useState(searchParams.get("district") ?? "");
  const [ownerCode, setOwnerCode] = useState(searchParams.get("ownerCode") ?? "");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");
  const [unitTypes, setUnitTypes] = useState<string[]>(searchParams.getAll("unitType"));

  function toggleUnitType(t: string) {
    setUnitTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function apply() {
    const params = new URLSearchParams();
    if (district) params.set("district", district);
    if (ownerCode) params.set("ownerCode", ownerCode);
    if (keyword) params.set("keyword", keyword);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    unitTypes.forEach((t) => params.append("unitType", t));
    router.push(`/buildings?${params.toString()}`);
  }

  function clearAll() {
    setDistrict("");
    setOwnerCode("");
    setKeyword("");
    setPriceMin("");
    setPriceMax("");
    setUnitTypes([]);
    router.push("/buildings");
  }

  const hasFilters =
    district || ownerCode || keyword || priceMin || priceMax || unitTypes.length > 0;

  return (
    <div className="mb-6 rounded-card border-[1.5px] border-line bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Quận / Huyện</label>
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full appearance-none rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-moss"
            >
              <option value="">Tất cả</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
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
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Giá từ (VNĐ)</label>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="0"
            className="w-full rounded-field border-[1.5px] border-line px-3 py-2.5 text-sm outline-none placeholder:text-placeholder focus:border-moss"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Giá đến (VNĐ)</label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="15000000"
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
