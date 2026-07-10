"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { searchOwners } from "@/app/(app)/admin/new-entry/actions";

type OwnerHit = { id: string; owner_code: string; full_name: string };

export function OwnerCombobox({
  value,
  onChange,
}: {
  value: { id: string; label: string } | null;
  onChange: (owner: { id: string; label: string } | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OwnerHit[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      const hits = await searchOwners(query);
      setResults(hits);
      setOpen(true);
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-field border-[1.5px] border-moss bg-white px-3 py-2.5">
        <span className="text-sm text-ink">{value.label}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-muted hover:text-ink"
          aria-label="Bỏ chọn"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 focus-within:border-moss">
        <Search size={14} className="text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Gõ mã chủ hoặc tên..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-placeholder"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-field border border-line bg-white shadow-lg">
          {results.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange({ id: o.id, label: `${o.owner_code} — ${o.full_name}` });
                  setQuery("");
                  setResults([]);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-paper"
              >
                <span className="font-semibold">{o.owner_code}</span> — {o.full_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-field border border-line bg-white px-3 py-2 text-sm text-muted shadow-lg">
          Không tìm thấy chủ sở hữu nào.
        </div>
      )}
    </div>
  );
}
