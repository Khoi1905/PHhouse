"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="max-h-full w-full max-w-xl overflow-y-auto rounded-card border border-line bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
