"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LockOpen, Plus, Trash2 } from "lucide-react";
import { Modal, Button, ConfirmDialog } from "@/components/ui";
import { CreateUserForm } from "./CreateUserForm";
import type { CreateUserValues } from "@/lib/validation";
import {
  createUserAction,
  toggleUserActiveAction,
  deleteUserAction,
} from "@/app/(app)/admin/users/actions";

export type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "sale";
  is_active: boolean;
};

export function UsersTable({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [togglePending, setTogglePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  function closeCreate() {
    if (!createPending) setCreateOpen(false);
  }

  async function submitCreate(values: CreateUserValues) {
    setCreateError(null);
    setCreatePending(true);
    try {
      const res = await createUserAction(values);
      if (!res.ok) {
        setCreateError(res.error);
        return;
      }
      setCreateOpen(false);
      router.refresh();
    } catch {
      setCreateError("Không thể kết nối để tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setCreatePending(false);
    }
  }

  async function runToggle(u: UserRow) {
    setActionError(null);
    setTogglePending(true);
    try {
      const res = await toggleUserActiveAction(u.id, !u.is_active);
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      setConfirmTarget(null);
      router.refresh();
    } catch {
      setActionError("Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại.");
    } finally {
      setTogglePending(false);
    }
  }

  function requestToggle(u: UserRow) {
    if (u.id === currentUserId) return;
    if (u.is_active) {
      setConfirmTarget(u);
      return;
    }
    void runToggle(u);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionError(null);
    setDeletePending(true);
    try {
      const res = await deleteUserAction(deleteTarget.id);
      if (!res.ok) {
        setActionError(res.error);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } catch {
      setActionError("Không thể xóa tài khoản. Vui lòng thử lại.");
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setCreateError(null);
            setCreateOpen(true);
          }}
        >
          <Plus size={15} />
          Tạo tài khoản
        </Button>
      </div>

      {actionError && (
        <p role="alert" className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">Vai trò</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isCurrentUser = u.id === currentUserId;
              const actionLabel = isCurrentUser
                ? "Không thể tự khóa tài khoản hiện tại"
                : u.is_active
                  ? `Khóa tài khoản ${u.email}`
                  : `Mở khóa tài khoản ${u.email}`;

              return (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="break-all px-4 py-3 text-ink">{u.email}</td>
                  <td className="px-4 py-3 text-ink">
                    <span>{u.full_name ?? "—"}</span>
                    {isCurrentUser && (
                      <span className="ml-2 rounded-pill bg-paper px-2 py-0.5 text-[11px] font-semibold text-muted-2">
                        Bạn
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-2">{u.role === "admin" ? "Admin" : "Sale"}</td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="rounded-pill bg-[#E8F0E5] px-2 py-0.5 text-[12px] font-semibold text-[#3E5641]">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="rounded-pill bg-danger-bg px-2 py-0.5 text-[12px] font-semibold text-danger-fg">
                        Đã khóa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => requestToggle(u)}
                        disabled={togglePending || isCurrentUser}
                        className="flex items-center gap-1.5 rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        title={actionLabel}
                        aria-label={actionLabel}
                      >
                        {u.is_active ? <Lock size={15} /> : <LockOpen size={15} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        disabled={isCurrentUser}
                        className="flex items-center gap-1.5 rounded-field p-1.5 text-muted-2 hover:bg-danger-bg hover:text-danger-fg disabled:cursor-not-allowed disabled:opacity-40"
                        title={isCurrentUser ? "Không thể tự xóa tài khoản hiện tại" : `Xóa tài khoản ${u.email}`}
                        aria-label={isCurrentUser ? "Không thể tự xóa tài khoản hiện tại" : `Xóa tài khoản ${u.email}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={createOpen} title="Tạo tài khoản mới" onClose={closeCreate} closeDisabled={createPending}>
        <CreateUserForm
          onSubmit={submitCreate}
          onCancel={closeCreate}
          pending={createPending}
          error={createError}
        />
      </Modal>

      <Modal
        open={!!confirmTarget}
        title="Khóa tài khoản?"
        onClose={() => {
          if (!togglePending) setConfirmTarget(null);
        }}
        closeDisabled={togglePending}
      >
        <p className="mb-5 text-sm leading-relaxed text-muted-2">
          Tài khoản <span className="font-semibold text-ink">{confirmTarget?.email}</span> sẽ không thể truy cập
          hệ thống cho đến khi được mở khóa lại.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" disabled={togglePending} onClick={() => setConfirmTarget(null)}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={togglePending || !confirmTarget}
            onClick={() => {
              if (confirmTarget) void runToggle(confirmTarget);
            }}
          >
            {togglePending ? "Đang khóa..." : "Khóa tài khoản"}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa tài khoản vĩnh viễn"
        description={`Tài khoản "${deleteTarget?.email}" sẽ bị xóa vĩnh viễn, không thể khôi phục. Lịch sử đổi giá/tình trạng do người này thực hiện vẫn được giữ lại nhưng mất tên hiển thị.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        pending={deletePending}
      />
    </div>
  );
}
