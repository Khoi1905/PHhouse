"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Pencil, Trash2 } from "lucide-react";
import { Modal, ConfirmDialog } from "@/components/ui";
import { OwnerEditForm } from "./OwnerEditForm";
import type { OwnerEditValues } from "@/lib/validation";
import { updateOwnerAction, deleteOwnerAction } from "@/app/(app)/owners/actions";

export type OwnerRow = {
  id: string;
  owner_code: string;
  full_name: string;
  phone: string;
  phone_secondary: string | null;
  email: string | null;
  bank_account: string | null;
  id_number: string | null;
  note: string | null;
  commission_sale_pct: number | null;
  commission_total_pct: number | null;
  building_count: number;
};

export function OwnersTable({ owners }: { owners: OwnerRow[] }) {
  const router = useRouter();
  const [editTarget, setEditTarget] = useState<OwnerRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<OwnerRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submitEdit(values: OwnerEditValues) {
    if (!editTarget) return;
    setError(null);
    startTransition(async () => {
      const res = await updateOwnerAction(editTarget.id, values);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setEditTarget(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const res = await deleteOwnerAction(deleteTarget.id);
      setDeleteTarget(null);
      if (res.ok) router.refresh();
    });
  }

  if (owners.length === 0) {
    return (
      <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
        Chưa có chủ sở hữu nào trong hệ thống.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Mã chủ</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">SĐT</th>
              <th className="px-4 py-3">Số tòa</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((o) => (
              <tr
                key={o.id}
                onClick={() => router.push(`/owners/${o.id}`)}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-paper"
              >
                <td className="px-4 py-3 font-semibold text-ink">{o.owner_code}</td>
                <td className="px-4 py-3 text-ink">{o.full_name}</td>
                <td className="px-4 py-3 text-muted-2">{o.phone}</td>
                <td className="px-4 py-3 text-ink">{o.building_count}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1.5">
                    <a
                      href={`/api/owners/${o.id}/export`}
                      className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
                      title="Xuất Excel"
                    >
                      <Download size={15} />
                    </a>
                    <button
                      onClick={() => setEditTarget(o)}
                      className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
                      title="Sửa"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(o)}
                      className="rounded-field p-1.5 text-muted-2 hover:bg-danger-bg hover:text-danger-fg"
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editTarget} title="Sửa thông tin chủ sở hữu" onClose={() => setEditTarget(null)}>
        {editTarget && (
          <OwnerEditForm
            defaultValues={{
              ownerCode: editTarget.owner_code,
              fullName: editTarget.full_name,
              phone: editTarget.phone,
              phoneSecondary: editTarget.phone_secondary ?? "",
              email: editTarget.email ?? "",
              bankAccount: editTarget.bank_account ?? "",
              idNumber: editTarget.id_number ?? "",
              ownerNote: editTarget.note ?? "",
              commissionSalePct: editTarget.commission_sale_pct?.toString() ?? "",
              commissionTotalPct: editTarget.commission_total_pct?.toString() ?? "",
            }}
            onSubmit={submitEdit}
            onCancel={() => setEditTarget(null)}
            pending={pending}
            error={error}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa chủ sở hữu vĩnh viễn"
        description={`Toàn bộ tòa nhà, phòng và lịch sử thay đổi thuộc "${deleteTarget?.full_name}" sẽ bị xóa vĩnh viễn, không thể khôi phục.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        pending={pending}
      />
    </div>
  );
}
