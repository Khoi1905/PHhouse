"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-field border-[1.5px] border-line px-3 py-1.5 text-sm font-semibold text-muted-2 disabled:opacity-35"
      >
        <ChevronLeft size={15} /> Trước
      </button>
      <span className="text-sm text-muted-2">
        Trang {page} / {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 rounded-field border-[1.5px] border-line px-3 py-1.5 text-sm font-semibold text-muted-2 disabled:opacity-35"
      >
        Sau <ChevronRight size={15} />
      </button>
    </div>
  );
}
