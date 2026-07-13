"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Tất cả",
}: {
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(o: string) {
    onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
  }

  const label = selected.length === 0 ? placeholder : `${selected.length} đã chọn`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-moss"
      >
        <span className={selected.length === 0 ? "text-placeholder" : "text-ink"}>{label}</span>
        <ChevronDown size={14} className="text-muted" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1.5 max-h-64 w-full min-w-[220px] overflow-y-auto rounded-field border-[1.5px] border-line bg-white p-1.5 shadow-lg">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mb-1 flex w-full items-center gap-1.5 rounded-field px-2 py-1.5 text-left text-xs font-semibold text-muted-2 hover:bg-paper"
            >
              <X size={12} /> Bỏ chọn tất cả
            </button>
          )}
          {options.map((o) => (
            <label
              key={o}
              className="flex cursor-pointer items-center gap-2 rounded-field px-2 py-1.5 text-sm text-ink hover:bg-paper"
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                className="accent-moss"
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
