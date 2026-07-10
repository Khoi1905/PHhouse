import { Lock } from "lucide-react";
import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  locked,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  locked?: boolean;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-[18px] flex flex-col gap-1.5 ${className ?? ""}`}>
      <label className="flex items-center justify-between font-sans text-[12.5px] font-semibold tracking-wide text-ink">
        <span>
          {label}
          {required && <span className="ml-[3px] text-clay">*</span>}
        </span>
        {locked && (
          <span className="inline-flex items-center gap-1 rounded-pill bg-locked-badgeBg px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-sale-lock">
            <Lock size={11} strokeWidth={2.4} />
            Chỉ admin
          </span>
        )}
      </label>
      {children}
      {hint && <p className="m-0 font-sans text-xs text-muted">{hint}</p>}
    </div>
  );
}
