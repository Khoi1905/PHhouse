"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { SlideOver, StatusPill } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import type { UnitStatus } from "@/lib/constants";

export type UnitSearchRow = {
  id: string;
  building_id: string;
  district: string;
  alley: string | null;
  access_type: string | null;
  owner_code: string;
  room_number: string;
  unit_type: string;
  price_month: number;
  status: UnitStatus;
  details_text: string | null;
  gdrive_folder_link: string | null;
  note: string | null;
};

export function UnitsSearchTable({ rows }: { rows: UnitSearchRow[] }) {
  const [slideOverUnit, setSlideOverUnit] = useState<UnitSearchRow | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Không tìm thấy phòng nào khớp với bộ lọc.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Quận / Huyện</th>
              <th className="px-4 py-3">Ngõ / Ngách</th>
              <th className="px-4 py-3">Số phòng</th>
              <th className="px-4 py-3">Loại phòng</th>
              <th className="px-4 py-3">Giá thuê / tháng</th>
              <th className="px-4 py-3">Tình trạng</th>
              <th className="px-4 py-3">Mã chủ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={u.id}
                onClick={() => setSlideOverUnit(u)}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
              >
                <td className="px-4 py-3 text-ink">{u.district}</td>
                <td className="px-4 py-3 text-muted-2">{u.alley || "—"}</td>
                <td className="px-4 py-3 font-semibold text-ink">{u.room_number}</td>
                <td className="px-4 py-3 text-ink">{u.unit_type}</td>
                <td className="px-4 py-3 text-ink">{formatPrice(u.price_month)} đ</td>
                <td className="px-4 py-3">
                  <StatusPill status={u.status} />
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{u.owner_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideOver
        open={!!slideOverUnit}
        onClose={() => setSlideOverUnit(null)}
        title={slideOverUnit ? `Phòng ${slideOverUnit.room_number}` : ""}
        subtitle={
          slideOverUnit
            ? `${slideOverUnit.unit_type} · ${formatPrice(slideOverUnit.price_month)} đ/tháng`
            : undefined
        }
      >
        {slideOverUnit && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={slideOverUnit.status} />
              <span className="text-[13px] text-muted-2">
                {slideOverUnit.district}
                {slideOverUnit.alley ? ` · ${slideOverUnit.alley}` : ""}
                {slideOverUnit.access_type ? ` · ${slideOverUnit.access_type}` : ""} · Mã chủ{" "}
                <span className="font-semibold text-ink">{slideOverUnit.owner_code}</span>
              </span>
            </div>

            <div>
              <p className="mb-1 text-[12.5px] font-semibold text-ink">Thông tin chi tiết</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-2">
                {slideOverUnit.details_text || "Chưa có thông tin."}
              </p>
            </div>

            {slideOverUnit.note && (
              <div>
                <p className="mb-1 text-[12.5px] font-semibold text-ink">Ghi chú nội bộ</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-2">
                  {slideOverUnit.note}
                </p>
              </div>
            )}

            {slideOverUnit.gdrive_folder_link && (
              <a
                href={slideOverUnit.gdrive_folder_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-moss hover:underline"
              >
                <ExternalLink size={14} /> Mở album ảnh
              </a>
            )}
          </div>
        )}
      </SlideOver>
    </div>
  );
}
