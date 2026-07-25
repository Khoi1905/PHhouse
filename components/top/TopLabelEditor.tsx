"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Modal, Button, Field, TextInput } from "@/components/ui";
import { updateTopLabelAction } from "@/app/(app)/top/actions";

export function TopLabelEditor({ currentLabel }: { currentLabel: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentLabel);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openModal() {
    setValue(currentLabel);
    setError(null);
    setOpen(true);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await updateTopLabelAction(value);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        title="Đổi tên hiển thị"
        className="rounded-field p-1.5 text-muted-2 hover:bg-paper hover:text-ink"
      >
        <Pencil size={16} />
      </button>

      <Modal open={open} title="Đổi tên hiển thị" onClose={() => setOpen(false)}>
        <Field label="Tên hiển thị" required hint='Ví dụ "Phòng hot", "Phòng giá rẻ" — danh sách phòng bên trong giữ nguyên.'>
          <TextInput value={value} onChange={(e) => setValue(e.target.value)} maxLength={60} />
        </Field>
        {error && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="button" variant="save" disabled={pending} onClick={submit}>
            {pending ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
