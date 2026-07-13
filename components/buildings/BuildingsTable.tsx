"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { pinBuildingAction } from "@/app/(app)/buildings/actions";

export type BuildingRow = {
  id: string;
  district: string;
  ward: string | null;
  alley: string | null;
  access_type: string | null;
  pinned_at: string | null;
  owner_code: string;
  total_units: number;
  vacant_units: number;
};

// View tòa chỉ admin xem trong luồng hiện tại (sale luôn ở view phòng), nhưng
// nút ghim vẫn gate isAdmin ngay trong component này — lớp phòng thủ phụ độc
// lập với logic ở trang gọi, đúng quy ước bảo mật 2 lớp của dự án.
export function BuildingsTable({ rows, isAdmin }: { rows: BuildingRow[]; isAdmin: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Không tìm thấy tòa nhà nào khớp với bộ lọc.
      </div>
    );
  }

  function togglePin(id: string, currentlyPinned: boolean, e: React.MouseEvent) {
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      const res = await pinBuildingAction(id, !currentlyPinned);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      {error && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}
      <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Quận / Huyện</th>
              <th className="px-4 py-3">Phường / Xã</th>
              <th className="px-4 py-3">Ngõ / Ngách</th>
              <th className="px-4 py-3">Thang máy/bộ</th>
              <th className="px-4 py-3">Mã chủ</th>
              <th className="px-4 py-3">Số phòng (tổng / trống)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isPinned = !!r.pinned_at;
              return (
                <tr
                  key={r.id}
                  onClick={() => router.push(`/buildings/${r.id}`)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
                >
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={(e) => togglePin(r.id, isPinned, e)}
                        title={isPinned ? "Bỏ ghim tòa" : "Ghim tòa"}
                        className="rounded-field p-1 text-muted-2 hover:bg-paper disabled:opacity-50"
                      >
                        <Star size={16} className={isPinned ? "fill-brand-orange text-brand-orange" : ""} />
                      </button>
                    ) : (
                      isPinned && <Star size={16} className="fill-brand-orange text-brand-orange" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{r.district}</td>
                  <td className="px-4 py-3 text-ink">{r.ward || "—"}</td>
                  <td className="px-4 py-3 text-muted-2">{r.alley || "—"}</td>
                  <td className="px-4 py-3 text-muted-2">{r.access_type || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{r.owner_code}</td>
                  <td className="px-4 py-3 text-ink">
                    {r.total_units} / <span className="text-moss">{r.vacant_units} trống</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
