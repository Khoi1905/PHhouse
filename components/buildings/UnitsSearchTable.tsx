"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Star } from "lucide-react";
import { SlideOver, StatusPill } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { pinUnitAction } from "@/app/(app)/buildings/actions";
import { useUrlParamState } from "@/lib/hooks/useUrlParamState";
import type { UnitStatus } from "@/lib/constants";

export type UnitSearchRow = {
  id: string;
  building_id: string;
  district: string;
  alley: string | null;
  access_type: string | null;
  pinned_at: string | null;
  owner_code: string;
  commission_sale_pct: number | null;
  room_number: string;
  unit_type: string[];
  price_month: number;
  status: UnitStatus;
  details_text: string | null;
  gdrive_folder_link: string | null;
  note: string | null;
};

export function UnitsSearchTable({ rows, isAdmin }: { rows: UnitSearchRow[]; isAdmin: boolean }) {
  const router = useRouter();
  const { value: openUnitId, open: openUnit, close: closeUnit } = useUrlParamState("unit");
  const slideOverUnit = rows.find((r) => r.id === openUnitId) ?? null;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Không tìm thấy phòng nào khớp với bộ lọc.
      </div>
    );
  }

  function togglePin(id: string, currentlyPinned: boolean, e: React.MouseEvent) {
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      const res = await pinUnitAction(id, !currentlyPinned);
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
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3"></th>
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
            {rows.map((u) => {
              const isPinned = !!u.pinned_at;
              return (
                <tr
                  key={u.id}
                  onClick={() => openUnit(u.id)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
                >
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={(e) => togglePin(u.id, isPinned, e)}
                        title={isPinned ? "Bỏ ghim phòng" : "Ghim phòng"}
                        className="rounded-field p-1 text-muted-2 hover:bg-paper disabled:opacity-50"
                      >
                        <Star size={16} className={isPinned ? "fill-brand-orange text-brand-orange" : ""} />
                      </button>
                    ) : (
                      isPinned && (
                        <Star size={16} className="fill-brand-orange text-brand-orange" />
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{u.district}</td>
                  <td className="px-4 py-3 text-muted-2">{u.alley || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{u.room_number}</td>
                  <td className="px-4 py-3 text-ink">{u.unit_type.join(", ")}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(u.price_month)} đ</td>
                  <td className="px-4 py-3">
                    <StatusPill status={u.status} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{u.owner_code}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SlideOver
        open={!!slideOverUnit}
        onClose={closeUnit}
        title={slideOverUnit ? `Phòng ${slideOverUnit.room_number}` : ""}
        subtitle={
          slideOverUnit
            ? `${slideOverUnit.unit_type.join(", ")} · ${formatPrice(slideOverUnit.price_month)} đ/tháng`
            : undefined
        }
      >
        {slideOverUnit && (
          <div className="space-y-4">
            {slideOverUnit.gdrive_folder_link && (
              <a
                href={slideOverUnit.gdrive_folder_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-field bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
              >
                <ExternalLink size={16} /> Mở album ảnh
              </a>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={slideOverUnit.status} />
              {slideOverUnit.pinned_at && (
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-orange">
                  <Star size={13} className="fill-brand-orange" /> Đã ghim
                </span>
              )}
              <span className="text-[13px] text-muted-2">
                {slideOverUnit.district}
                {slideOverUnit.alley ? ` · ${slideOverUnit.alley}` : ""}
                {slideOverUnit.access_type ? ` · ${slideOverUnit.access_type}` : ""} · Mã chủ{" "}
                <span className="font-semibold text-ink">{slideOverUnit.owner_code}</span>
              </span>
            </div>

            {slideOverUnit.commission_sale_pct != null && (
              <p className="text-sm text-muted-2">Hoa hồng cho sale: {slideOverUnit.commission_sale_pct}%</p>
            )}

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
          </div>
        )}
      </SlideOver>
    </div>
  );
}
