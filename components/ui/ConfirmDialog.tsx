"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "./Button";

/**
 * Dialog xác nhận cho hành động xóa vĩnh viễn (hard delete). Người dùng phải
 * gõ đúng chữ "XÓA" mới bấm được nút xác nhận — đây là lớp xác nhận thứ 2
 * theo yêu cầu spec cho mọi thao tác xóa không thể khôi phục.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  pending,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
}) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const canConfirm = typed.trim().toUpperCase() === "XÓA";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-6">
        <div className="mb-3 flex items-center gap-2 text-[#9C4A4A]">
          <TriangleAlert size={20} />
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        </div>
        <p className="mb-4 text-sm text-muted-2">{description}</p>
        <p className="mb-1.5 text-[12.5px] font-semibold text-ink">
          Gõ <span className="text-[#9C4A4A]">XÓA</span> để xác nhận
        </p>
        <input
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className="mb-4 w-full rounded-field border-[1.5px] border-line px-3 py-2 text-sm outline-none focus:border-[#9C4A4A]"
          placeholder="XÓA"
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={!canConfirm || pending}
            onClick={onConfirm}
          >
            {pending ? "Đang xóa..." : "Xóa vĩnh viễn"}
          </Button>
        </div>
      </div>
    </div>
  );
}
