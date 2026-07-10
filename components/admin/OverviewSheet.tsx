"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, ExternalLink, Lock } from "lucide-react";
import { StatusPill } from "@/components/ui";
import { formatPrice, stripDiacritics } from "@/lib/format";
import type { UnitStatus } from "@/lib/constants";

export type OverviewRow = {
  buildingId: string;
  district: string;
  ward: string | null;
  alley: string | null;
  houseNumber: string | null;
  unitId: string;
  roomNumber: string;
  unitType: string;
  priceMonth: number;
  status: UnitStatus;
  detailsText: string | null;
  gdriveLink: string | null;
  note: string | null;
};

export type OwnerSheet = {
  id: string;
  ownerCode: string;
  fullName: string;
  rows: OverviewRow[];
};

export function OverviewSheet({ sheets }: { sheets: OwnerSheet[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(sheets[0]?.id ?? null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const filteredSheets = useMemo(() => {
    if (!search.trim()) return sheets;
    const q = stripDiacritics(search);
    return sheets.filter(
      (s) => stripDiacritics(s.ownerCode).includes(q) || stripDiacritics(s.fullName).includes(q)
    );
  }, [sheets, search]);

  const selected = sheets.find((s) => s.id === selectedId) ?? filteredSheets[0] ?? null;

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allFilteredChecked =
    filteredSheets.length > 0 && filteredSheets.every((s) => checkedIds.has(s.id));

  function toggleCheckAllFiltered() {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredChecked) {
        filteredSheets.forEach((s) => next.delete(s.id));
      } else {
        filteredSheets.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Bảng tổng hợp</h1>
        <p className="mt-1 text-sm text-muted-2">
          Xem nhanh toàn bộ phòng theo từng chủ sở hữu — chỉ xem, không sửa được ở đây.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <aside className="w-full flex-shrink-0 md:w-64">
          <div className="mb-3 flex items-center gap-2 rounded-field border-[1.5px] border-line bg-white px-3 py-2">
            <Search size={14} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã chủ hoặc tên..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-placeholder"
            />
          </div>
          <div className="mb-2 flex items-center justify-between px-1">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-2">
              <input
                type="checkbox"
                checked={allFilteredChecked}
                onChange={toggleCheckAllFiltered}
                disabled={filteredSheets.length === 0}
              />
              Chọn tất cả
            </label>
            {checkedIds.size > 0 && (
              <span className="text-xs font-semibold text-brand-orange">{checkedIds.size} đã chọn</span>
            )}
          </div>

          <div className="max-h-[55vh] overflow-y-auto rounded-card border-[1.5px] border-line bg-white">
            {filteredSheets.length === 0 && (
              <p className="p-4 text-sm text-muted">Không tìm thấy chủ sở hữu nào.</p>
            )}
            {filteredSheets.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2.5 border-b border-line px-3 py-2.5 last:border-0 ${
                  selected?.id === s.id ? "bg-paper" : "hover:bg-paper"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedIds.has(s.id)}
                  onChange={() => toggleChecked(s.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setSelectedId(s.id)}
                  className={`min-w-0 flex-1 text-left text-sm ${
                    selected?.id === s.id ? "font-semibold text-ink" : "text-muted-2"
                  }`}
                >
                  <span className="font-semibold">{s.ownerCode}</span>
                  <span className="block truncate text-xs text-muted">{s.fullName}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {checkedIds.size > 0 ? (
              <a
                href={`/api/owners/export?ids=${Array.from(checkedIds).join(",")}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-field border-[1.5px] border-line px-3 py-2 text-[13px] font-semibold text-muted-2 hover:border-ink hover:text-ink"
              >
                <Download size={14} /> Xuất đã chọn ({checkedIds.size})
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-field border-[1.5px] border-line px-3 py-2 text-[13px] font-semibold text-placeholder">
                <Download size={14} /> Xuất đã chọn (0)
              </span>
            )}
            <a
              href="/api/owners/export"
              className="inline-flex items-center justify-center gap-1.5 rounded-field bg-ink px-3 py-2 text-[13px] font-semibold text-paper hover:opacity-90"
            >
              <Download size={14} /> Xuất tất cả ({sheets.length} chủ)
            </a>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {!selected ? (
            <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
              Chọn 1 chủ sở hữu ở danh sách bên trái để xem.
            </div>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {selected.ownerCode} — {selected.fullName}{" "}
                  <span className="font-sans text-sm font-normal text-muted">
                    ({selected.rows.length} phòng)
                  </span>
                </h2>
                <a
                  href={`/api/owners/${selected.id}/export`}
                  className="inline-flex items-center gap-1.5 rounded-field border-[1.5px] border-line px-3 py-1.5 text-[13px] font-semibold text-muted-2 hover:border-ink hover:text-ink"
                >
                  <Download size={14} /> Xuất Excel
                </a>
              </div>

              {selected.rows.length === 0 ? (
                <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                  Chủ này chưa có phòng nào.
                </div>
              ) : (
                <div className="max-h-[70vh] overflow-auto rounded-card border-[1.5px] border-line bg-white">
                  <table className="w-full min-w-[1000px] border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="sticky top-0 z-10 bg-paper text-[11px] font-semibold uppercase tracking-wide text-muted">
                        <th className="border-b border-r border-line px-3 py-2">Quận/Huyện</th>
                        <th className="border-b border-r border-line px-3 py-2">Phường/Xã</th>
                        <th className="border-b border-r border-line px-3 py-2">Ngõ/Ngách</th>
                        <th className="border-b border-r border-line px-3 py-2">
                          <span className="inline-flex items-center gap-1 text-sale-lock">
                            <Lock size={10} /> Số nhà
                          </span>
                        </th>
                        <th className="border-b border-r border-line px-3 py-2">Số phòng</th>
                        <th className="border-b border-r border-line px-3 py-2">Loại</th>
                        <th className="border-b border-r border-line px-3 py-2">Giá/tháng</th>
                        <th className="border-b border-r border-line px-3 py-2">Tình trạng</th>
                        <th className="border-b border-r border-line px-3 py-2">Ghi chú</th>
                        <th className="border-b border-line px-3 py-2 text-right">Mở</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.rows.map((r) => (
                        <tr key={r.unitId} className="odd:bg-white even:bg-[#FBFAF7]">
                          <td className="border-b border-r border-line px-3 py-2 text-ink">{r.district}</td>
                          <td className="border-b border-r border-line px-3 py-2 text-ink">{r.ward || "—"}</td>
                          <td className="border-b border-r border-line px-3 py-2 text-muted-2">{r.alley || "—"}</td>
                          <td className="border-b border-r border-line px-3 py-2 text-sale-lock">
                            {r.houseNumber || "—"}
                          </td>
                          <td className="border-b border-r border-line px-3 py-2 font-semibold text-ink">
                            {r.roomNumber}
                          </td>
                          <td className="border-b border-r border-line px-3 py-2 text-ink">{r.unitType}</td>
                          <td className="border-b border-r border-line px-3 py-2 text-ink">
                            {formatPrice(r.priceMonth)} đ
                          </td>
                          <td className="border-b border-r border-line px-3 py-2">
                            <StatusPill status={r.status} />
                          </td>
                          <td className="max-w-[240px] truncate border-b border-r border-line px-3 py-2 text-muted-2">
                            {r.note || "—"}
                          </td>
                          <td className="border-b border-line px-3 py-2 text-right">
                            <Link
                              href={`/buildings/${r.buildingId}`}
                              className="inline-flex items-center gap-1 text-muted hover:text-moss"
                              title="Mở trang tòa nhà"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
