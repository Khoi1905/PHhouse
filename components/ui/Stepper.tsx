import { Check, type LucideIcon } from "lucide-react";

export type Step = { id: string; label: string; icon: LucideIcon };

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: Step[];
  current: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="mb-[26px] flex items-center">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === current;
        const isDone = i < current;
        const clickable = !!onStepClick && isDone;
        return (
          <div key={s.id} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(i)}
              className={`flex items-center gap-[7px] whitespace-nowrap bg-transparent py-1.5 font-sans text-[13px] font-semibold ${
                isActive || isDone ? "text-ink" : "text-placeholder"
              } ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isActive || isDone ? "bg-moss text-paper" : "bg-[#E9E7E1] text-muted"
                }`}
              >
                {isDone ? <Check size={14} strokeWidth={2.6} /> : <Icon size={14} strokeWidth={2.4} />}
              </span>
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <div className={`mx-2.5 h-[1.5px] flex-1 ${isDone ? "bg-moss" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
