"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Building2, DoorOpen } from "lucide-react";

// Chỉ admin thấy. Đổi giữa "xem theo tòa" và "xem theo phòng" mà vẫn giữ
// nguyên các bộ lọc hiện tại trên URL (chỉ thay/chèn param view, reset page).
export function ViewModeToggle({ mode }: { mode: "buildings" | "units" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function switchTo(next: "buildings" | "units") {
    if (next === mode) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    params.delete("page");
    router.push(`/buildings?${params.toString()}`);
  }

  const base =
    "inline-flex items-center gap-1.5 rounded-field px-3 py-1.5 text-[13px] font-semibold transition-colors";
  const active = "bg-moss text-paper";
  const idle = "text-muted-2 hover:text-ink";

  return (
    <div className="inline-flex rounded-field border-[1.5px] border-line bg-white p-0.5">
      <button
        type="button"
        onClick={() => switchTo("buildings")}
        className={`${base} ${mode === "buildings" ? active : idle}`}
      >
        <Building2 size={15} /> Theo tòa
      </button>
      <button
        type="button"
        onClick={() => switchTo("units")}
        className={`${base} ${mode === "units" ? active : idle}`}
      >
        <DoorOpen size={15} /> Theo phòng
      </button>
    </div>
  );
}
