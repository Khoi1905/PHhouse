"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function SlideOver({
  open,
  title,
  subtitle,
  headerExtra,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  headerExtra?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
          </div>
          <div className="flex items-start gap-3">
            {headerExtra}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-73px)] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
