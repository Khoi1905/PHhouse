"use client";

import { useRouter } from "next/navigation";

export type BuildingRow = {
  id: string;
  district: string;
  ward: string | null;
  alley: string | null;
  owner_code: string;
  total_units: number;
  vacant_units: number;
};

export function BuildingsTable({ rows }: { rows: BuildingRow[] }) {
  const router = useRouter();

  if (rows.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Không tìm thấy tòa nhà nào khớp với bộ lọc.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Quận / Huyện</th>
            <th className="px-4 py-3">Phường / Xã</th>
            <th className="px-4 py-3">Ngõ / Ngách</th>
            <th className="px-4 py-3">Mã chủ</th>
            <th className="px-4 py-3">Số phòng (tổng / trống)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              onClick={() => router.push(`/buildings/${r.id}`)}
              className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
            >
              <td className="px-4 py-3 text-ink">{r.district}</td>
              <td className="px-4 py-3 text-ink">{r.ward || "—"}</td>
              <td className="px-4 py-3 text-muted-2">{r.alley || "—"}</td>
              <td className="px-4 py-3 font-semibold text-ink">{r.owner_code}</td>
              <td className="px-4 py-3 text-ink">
                {r.total_units} / <span className="text-moss">{r.vacant_units} trống</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
