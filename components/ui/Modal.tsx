"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  closeDisabled = false,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  closeDisabled?: boolean;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4 sm:py-8">
      <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-card border border-line bg-white p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label={`Đóng ${title}`}
            className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
