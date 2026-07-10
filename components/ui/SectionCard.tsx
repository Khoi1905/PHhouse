import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

const SHADES = ["bg-white", "bg-[#FBFAF7]", "bg-paper"];

export function SectionCard({
  depth = 0,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  depth?: 0 | 1 | 2;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative mb-4 rounded-card border-[1.5px] border-line ${SHADES[depth]} p-6`}
      style={{ marginLeft: depth * 18 }}
    >
      <div className="mb-[18px] flex items-start gap-3">
        <div className="mt-px flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-moss text-paper">
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="m-0 font-display text-lg font-semibold text-ink">{title}</h3>
          {subtitle && <p className="m-0 font-sans text-[12.5px] text-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}
