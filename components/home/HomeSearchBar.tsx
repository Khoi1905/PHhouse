"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Select, Button, MultiSelectDropdown } from "@/components/ui";
import { DISTRICTS, UNIT_TYPES } from "@/lib/constants";

export function HomeSearchBar() {
  const router = useRouter();
  const [districts, setDistricts] = useState<string[]>([]);
  const [unitType, setUnitType] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    districts.forEach((d) => params.append("district", d));
    if (unitType) params.set("unitType", unitType);
    const query = params.toString();
    router.push(query ? `/buildings?${query}` : "/buildings");
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border-[1.5px] border-line bg-white p-4 sm:flex-row sm:items-end sm:p-5">
      <div className="flex-1">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Khu vực</label>
        <MultiSelectDropdown options={DISTRICTS} selected={districts} onChange={setDistricts} />
      </div>
      <div className="flex-1">
        <label className="mb-1.5 block text-[12.5px] font-semibold text-ink">Loại phòng</label>
        <Select options={UNIT_TYPES} value={unitType} onChange={(e) => setUnitType(e.target.value)} />
      </div>
      <Button type="button" variant="primary" onClick={handleSearch} className="sm:flex-shrink-0">
        <Search size={16} /> Tìm phòng ngay
      </Button>
    </div>
  );
}
