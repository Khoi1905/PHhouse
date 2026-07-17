"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Check, ExternalLink, History, Pencil, Plus, SquarePen, Star, Trash2, X } from "lucide-react";
import { Button, ConfirmDialog, Modal, SlideOver, StatusPill } from "@/components/ui";
import { UnitFields } from "@/components/forms/UnitFields";
import { UNIT_STATUSES, type UnitStatus } from "@/lib/constants";
import { formatPrice, vndToTrieuStr, trieuStrToVnd } from "@/lib/format";
import { useUrlParamState } from "@/lib/hooks/useUrlParamState";
import { unitStepSchema, type WizardFormValues } from "@/lib/validation";
import {
  deleteUnitAction,
  updateUnitFull,
  updateUnitQuickFields,
} from "@/app/(app)/buildings/[id]/actions";
import { pinUnitAction } from "@/app/(app)/buildings/actions";

export type UnitRow = {
  id: string;
  room_number: string;
  unit_type: string[];
  price_month: number;
  status: UnitStatus;
  details_text: string | null;
  gdrive_folder_link: string | null;
  note: string | null;
  pinned_at: string | null;
};

export function UnitsTable({
  buildingId,
  units,
  isAdmin,
}: {
  buildingId: string;
  units: UnitRow[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickValues, setQuickValues] = useState({ priceMonth: 0, status: "Trống" as UnitStatus, gdriveFolderLink: "" });
  const { value: openUnitId, open: openUnit, close: closeUnit } = useUrlParamState("unit");
  const slideOverUnit = units.find((u) => u.id === openUnitId) ?? null;
  const [fullEditUnit, setFullEditUnit] = useState<UnitRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UnitRow | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startQuickEdit(u: UnitRow) {
    setQuickEditId(u.id);
    setQuickValues({
      priceMonth: u.price_month,
      status: u.status,
      gdriveFolderLink: u.gdrive_folder_link ?? "",
    });
    setRowError(null);
  }

  function saveQuickEdit(unitId: string) {
    startTransition(async () => {
      const res = await updateUnitQuickFields(unitId, buildingId, quickValues);
      if (!res.ok) {
        setRowError(res.error);
        return;
      }
      setQuickEditId(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteUnitAction(deleteTarget.id, buildingId);
      setDeleteTarget(null);
      if (res.ok) router.refresh();
    });
  }

  function togglePin(unitId: string, currentlyPinned: boolean) {
    startTransition(async () => {
      const res = await pinUnitAction(unitId, !currentlyPinned, buildingId);
      if (!res.ok) {
        setRowError(res.error);
        return;
      }
      router.refresh();
    });
  }

  if (units.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center">
        <p className="mb-4 text-sm text-muted">Tòa nhà này chưa có phòng nào.</p>
        {isAdmin && (
          <Button variant="primary" onClick={() => router.push(`/buildings/${buildingId}/new-unit`)}>
            <Plus size={15} /> Thêm phòng
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-3 flex justify-end">
          <Button variant="primary" onClick={() => router.push(`/buildings/${buildingId}/new-unit`)}>
            <Plus size={15} /> Thêm phòng
          </Button>
        </div>
      )}

      {rowError && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{rowError}</p>}

      <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Số phòng</th>
              <th className="px-4 py-3">Loại phòng</th>
              <th className="px-4 py-3">Giá thuê / tháng</th>
              <th className="px-4 py-3">Tình trạng</th>
              <th className="px-4 py-3">Ảnh</th>
              {isAdmin && <th className="px-4 py-3 text-right">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const editing = quickEditId === u.id;
              return (
                <tr
                  key={u.id}
                  onClick={() => !editing && openUnit(u.id)}
                  className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
                >
                  <td className="px-4 py-3 font-semibold text-ink">{u.room_number}</td>
                  <td className="px-4 py-3 text-ink">{u.unit_type.join(", ")}</td>
                  <td className="px-4 py-3 text-ink" onClick={(e) => editing && e.stopPropagation()}>
                    {editing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={vndToTrieuStr(quickValues.priceMonth)}
                        onChange={(e) =>
                          setQuickValues((v) => ({ ...v, priceMonth: trieuStrToVnd(e.target.value) ?? 0 }))
                        }
                        placeholder="7.5"
                        className="w-28 rounded-field border-[1.5px] border-line px-2 py-1 text-sm outline-none focus:border-moss"
                      />
                    ) : (
                      `${formatPrice(u.price_month)} đ`
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => editing && e.stopPropagation()}>
                    {editing ? (
                      <select
                        value={quickValues.status}
                        onChange={(e) =>
                          setQuickValues((v) => ({ ...v, status: e.target.value as UnitStatus }))
                        }
                        className="rounded-field border-[1.5px] border-line px-2 py-1 text-sm outline-none focus:border-moss"
                      >
                        {UNIT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusPill status={u.status} />
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {editing ? (
                      <input
                        value={quickValues.gdriveFolderLink}
                        onChange={(e) =>
                          setQuickValues((v) => ({ ...v, gdriveFolderLink: e.target.value }))
                        }
                        placeholder="Link Drive"
                        className="w-40 rounded-field border-[1.5px] border-line px-2 py-1 text-sm outline-none focus:border-moss"
                      />
                    ) : u.gdrive_folder_link ? (
                      <a
                        href={u.gdrive_folder_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-moss"
                      >
                        <ExternalLink size={16} />
                      </a>
                    ) : (
                      <span className="text-placeholder">—</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        {editing ? (
                          <>
                            <button
                              onClick={() => saveQuickEdit(u.id)}
                              disabled={pending}
                              className="rounded-field p-1.5 text-moss hover:bg-status-trong-bg"
                              title="Lưu"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setQuickEditId(null)}
                              className="rounded-field p-1.5 text-muted hover:bg-paper"
                              title="Hủy"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => togglePin(u.id, !!u.pinned_at)}
                              disabled={pending}
                              className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink disabled:opacity-50"
                              title={u.pinned_at ? "Bỏ ghim phòng" : "Ghim phòng"}
                            >
                              <Star size={15} className={u.pinned_at ? "fill-brand-orange text-brand-orange" : ""} />
                            </button>
                            <button
                              onClick={() => startQuickEdit(u)}
                              className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
                              title="Sửa nhanh"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setFullEditUnit(u)}
                              className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
                              title="Sửa đầy đủ"
                            >
                              <SquarePen size={15} />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/units/${u.id}/history`)}
                              className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
                              title="Lịch sử thay đổi"
                            >
                              <History size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(u)}
                              className="rounded-field p-1.5 text-muted-2 hover:bg-danger-bg hover:text-danger-fg"
                              title="Xóa"
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
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
            <div>
              <p className="mb-1 text-[12.5px] font-semibold text-ink">Thông tin chi tiết</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-2">
                {slideOverUnit.details_text || "Chưa có thông tin."}
              </p>
            </div>
            {slideOverUnit.note && (
              <div>
                <p className="mb-1 text-[12.5px] font-semibold text-ink">Ghi chú nội bộ</p>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-2">{slideOverUnit.note}</p>
              </div>
            )}
          </div>
        )}
      </SlideOver>

      <FullEditUnitModal
        unit={fullEditUnit}
        buildingId={buildingId}
        onClose={() => setFullEditUnit(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa phòng vĩnh viễn"
        description={`Phòng "${deleteTarget?.room_number}" và toàn bộ lịch sử thay đổi giá/tình trạng sẽ bị xóa vĩnh viễn, không thể khôi phục.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        pending={pending}
      />
    </div>
  );
}

function FullEditUnitModal({
  unit,
  buildingId,
  onClose,
}: {
  unit: UnitRow | null;
  buildingId: string;
  onClose: () => void;
}) {
  return (
    <Modal open={!!unit} title={unit ? `Sửa đầy đủ — Phòng ${unit.room_number}` : ""} onClose={onClose}>
      {unit && <FullEditUnitForm unit={unit} buildingId={buildingId} onClose={onClose} />}
    </Modal>
  );
}

function FullEditUnitForm({
  unit,
  buildingId,
  onClose,
}: {
  unit: UnitRow;
  buildingId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const methods = useForm<WizardFormValues>({
    defaultValues: {
      mode: "new",
      roomNumber: unit.room_number,
      unitTypes: unit.unit_type as WizardFormValues["unitTypes"],
      priceMonth: unit.price_month,
      status: unit.status,
      detailsText: unit.details_text ?? "",
      gdriveFolderLink: unit.gdrive_folder_link ?? "",
      unitNote: unit.note ?? "",
    },
  });

  function onSubmit(values: WizardFormValues) {
    setError(null);
    const parsed = unitStepSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.");
      return;
    }
    startTransition(async () => {
      const res = await updateUnitFull(unit.id, buildingId, values);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <UnitFields />
        {error && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="save" disabled={pending}>
            {pending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
