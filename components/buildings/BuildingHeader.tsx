"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Pencil, Trash2, Building2, Star, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Modal, ConfirmDialog } from "@/components/ui";
import { BuildingFields } from "@/components/forms/BuildingFields";
import { buildingStepSchema, type WizardFormValues } from "@/lib/validation";
import { updateBuildingAction, deleteBuildingAction } from "@/app/(app)/buildings/[id]/actions";
import { pinBuildingAction } from "@/app/(app)/buildings/actions";

export type BuildingHeaderData = {
  id: string;
  district: string;
  ward: string | null;
  alley: string | null;
  houseNumber: string | null;
  guideName?: string | null;
  guidePhone?: string | null;
  accessType?: string | null;
  pinnedAt?: string | null;
  ownerCode: string;
  ownerName?: string;
  // Chỉ truyền từ trang chi tiết tòa nhà. Trang chủ sở hữu cố ý KHÔNG truyền:
  // ở đó đã có sẵn nút "Thêm tòa nhà mới" ở đầu trang, truyền vào sẽ lặp nút
  // trên từng thẻ tòa nhà.
  ownerId?: string;
  commissionSalePct?: number | null;
  commissionTotalPct?: number | null;
};

export function BuildingHeader({ data, isAdmin }: { data: BuildingHeaderData; isAdmin: boolean }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const methods = useForm<WizardFormValues>({
    defaultValues: {
      mode: "new",
      status: "Trống",
      district: data.district as WizardFormValues["district"],
      ward: data.ward ?? "",
      alley: data.alley ?? "",
      houseNumber: data.houseNumber ?? "",
      guideName: data.guideName ?? "",
      guidePhone: data.guidePhone ?? "",
      accessType: (data.accessType as WizardFormValues["accessType"]) ?? "",
    },
  });

  function onSubmitEdit(values: WizardFormValues) {
    setError(null);
    const parsed = buildingStepSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ.");
      return;
    }
    startTransition(async () => {
      const res = await updateBuildingAction(data.id, values);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEditOpen(false);
      router.refresh();
    });
  }

  function onConfirmDelete() {
    startTransition(async () => {
      const res = await deleteBuildingAction(data.id);
      if (res.ok) {
        router.push("/buildings");
      } else {
        setError(res.error);
        setDeleteOpen(false);
      }
    });
  }

  const isPinned = !!data.pinnedAt;

  function togglePin() {
    startTransition(async () => {
      const res = await pinBuildingAction(data.id, !isPinned);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  const addressLine = [data.district, data.ward, data.alley].filter(Boolean).join(", ");

  return (
    <div className="mb-6 rounded-card border-[1.5px] border-line bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] bg-moss text-paper">
            <Building2 size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">{addressLine}</h1>
            {isAdmin && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-sale-lock">
                <Lock size={12} />
                Số nhà: {data.houseNumber || "—"}
              </p>
            )}
            {isAdmin && (data.guideName || data.guidePhone) && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-sale-lock">
                <Lock size={12} />
                Người dẫn: {data.guideName || "—"}
                {data.guidePhone ? ` · ${data.guidePhone}` : ""}
              </p>
            )}
            <p className="mt-1 text-sm text-muted-2">
              Chủ sở hữu: <span className="font-semibold text-ink">{data.ownerCode}</span>
              {isAdmin && data.ownerName ? ` — ${data.ownerName}` : ""}
            </p>
            {data.accessType && (
              <p className="mt-1 text-sm text-muted-2">{data.accessType}</p>
            )}
            {data.commissionSalePct != null && (
              <p className="mt-1 text-sm text-muted-2">Hoa hồng cho sale: {data.commissionSalePct}%</p>
            )}
            {isAdmin && data.commissionTotalPct != null && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-sale-lock">
                <Lock size={12} />
                Hoa hồng tổng: {data.commissionTotalPct}%
              </p>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            {data.ownerId && (
              // Tái dùng đúng luồng của trang chủ sở hữu: wizard đọc 2 tham số
              // này rồi bỏ qua bước chọn chủ, nhảy thẳng vào bước Tòa nhà.
              <Link
                href={`/admin/new-entry?ownerId=${data.ownerId}&ownerLabel=${encodeURIComponent(
                  data.ownerName ? `${data.ownerCode} — ${data.ownerName}` : data.ownerCode
                )}`}
                className="inline-flex items-center gap-1.5 rounded-[9px] border-[1.5px] border-line px-[18px] py-2.5 font-sans text-[13.5px] font-semibold text-muted-2 transition-opacity hover:opacity-90"
              >
                <Plus size={14} /> Thêm tòa cùng chủ
              </Link>
            )}
            <Button variant="ghost" onClick={togglePin} disabled={pending}>
              <Star size={14} className={isPinned ? "fill-brand-orange text-brand-orange" : ""} />
              {isPinned ? "Bỏ ghim" : "Ghim tòa nhà"}
            </Button>
            <Button variant="ghost" onClick={() => setEditOpen(true)}>
              <Pencil size={14} /> Sửa tòa nhà
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={14} /> Xóa tòa nhà
            </Button>
          </div>
        )}
      </div>

      {error && <p className="mt-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}

      <Modal open={editOpen} title="Sửa thông tin tòa nhà" onClose={() => setEditOpen(false)}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmitEdit)}>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <BuildingFields />
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="save" disabled={pending}>
                {pending ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Xóa tòa nhà vĩnh viễn"
        description={`Toàn bộ phòng và lịch sử thay đổi thuộc tòa nhà "${addressLine}" sẽ bị xóa vĩnh viễn theo, không thể khôi phục.`}
        onConfirm={onConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
        pending={pending}
      />
    </div>
  );
}
