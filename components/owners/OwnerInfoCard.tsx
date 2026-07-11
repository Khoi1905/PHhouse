"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, User } from "lucide-react";
import { Button, Modal, ConfirmDialog } from "@/components/ui";
import { OwnerEditForm } from "./OwnerEditForm";
import type { OwnerEditValues } from "@/lib/validation";
import { updateOwnerAction, deleteOwnerAction } from "@/app/(app)/owners/actions";
import type { OwnerRow } from "./OwnersTable";

export function OwnerInfoCard({ owner }: { owner: OwnerRow }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitEdit(values: OwnerEditValues) {
    setError(null);
    startTransition(async () => {
      const res = await updateOwnerAction(owner.id, values);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEditOpen(false);
      router.refresh();
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const res = await deleteOwnerAction(owner.id);
      if (res.ok) {
        router.push("/owners");
      } else {
        setError(res.error);
        setDeleteOpen(false);
      }
    });
  }

  return (
    <div className="mb-6 rounded-card border-[1.5px] border-line bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] bg-moss text-paper">
            <User size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">{owner.full_name}</h1>
            <p className="mt-1 text-sm text-muted-2">
              Mã chủ: <span className="font-semibold text-ink">{owner.owner_code}</span> · {owner.phone}
              {owner.phone_secondary ? ` / ${owner.phone_secondary}` : ""}
            </p>
            {owner.email && <p className="mt-0.5 text-sm text-muted-2">{owner.email}</p>}
            {owner.bank_account && <p className="mt-0.5 text-sm text-muted-2">STK: {owner.bank_account}</p>}
            {(owner.commission_sale_pct != null || owner.commission_total_pct != null) && (
              <p className="mt-0.5 text-sm text-muted-2">
                {owner.commission_sale_pct != null && `Hoa hồng sale: ${owner.commission_sale_pct}%`}
                {owner.commission_sale_pct != null && owner.commission_total_pct != null && " · "}
                {owner.commission_total_pct != null && (
                  <span className="text-sale-lock">Hoa hồng tổng: {owner.commission_total_pct}%</span>
                )}
              </p>
            )}
            {owner.note && <p className="mt-2 text-sm text-muted">{owner.note}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setEditOpen(true)}>
            <Pencil size={14} /> Sửa
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={14} /> Xóa
          </Button>
        </div>
      </div>

      {error && <p className="mt-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}

      <Modal open={editOpen} title="Sửa thông tin chủ sở hữu" onClose={() => setEditOpen(false)}>
        <OwnerEditForm
          defaultValues={{
            ownerCode: owner.owner_code,
            fullName: owner.full_name,
            phone: owner.phone,
            phoneSecondary: owner.phone_secondary ?? "",
            email: owner.email ?? "",
            bankAccount: owner.bank_account ?? "",
            idNumber: owner.id_number ?? "",
            ownerNote: owner.note ?? "",
            commissionSalePct: owner.commission_sale_pct?.toString() ?? "",
            commissionTotalPct: owner.commission_total_pct?.toString() ?? "",
          }}
          onSubmit={submitEdit}
          onCancel={() => setEditOpen(false)}
          pending={pending}
          error={null}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Xóa chủ sở hữu vĩnh viễn"
        description={`Toàn bộ tòa nhà, phòng và lịch sử thay đổi thuộc "${owner.full_name}" sẽ bị xóa vĩnh viễn, không thể khôi phục.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
        pending={pending}
      />
    </div>
  );
}
