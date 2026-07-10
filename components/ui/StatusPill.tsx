import { STATUS_STYLES, UNIT_STATUSES, type UnitStatus } from "@/lib/constants";

export function StatusPill({ status }: { status: UnitStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className="inline-block whitespace-nowrap rounded-pill border-[1.5px] px-2.5 py-1 font-sans text-xs font-semibold"
      style={{ background: style.bg, color: style.fg, borderColor: style.fg }}
    >
      {status}
    </span>
  );
}

export function StatusPicker({
  value,
  onChange,
}: {
  value: UnitStatus;
  onChange: (status: UnitStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-0.5">
      {UNIT_STATUSES.map((s) => {
        const active = value === s;
        const style = STATUS_STYLES[s];
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="rounded-pill border-[1.5px] px-[11px] py-1.5 font-sans text-xs font-semibold transition-colors"
            style={
              active
                ? { background: style.bg, color: style.fg, borderColor: style.fg }
                : { background: "#FFFFFF", color: "#8A8578", borderColor: "#D8D5CC" }
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
