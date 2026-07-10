import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, formatPrice } from "@/lib/format";

const FIELD_LABELS: Record<string, string> = {
  price_month: "Giá thuê",
  status: "Tình trạng",
};

function formatValue(field: string, value: string | null) {
  if (value === null) return "—";
  if (field === "price_month") {
    const n = Number(value);
    return Number.isNaN(n) ? value : `${formatPrice(n)} đ`;
  }
  return value;
}

export default async function UnitHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: unit } = await supabase
    .from("units")
    .select("id, room_number, building_id")
    .eq("id", id)
    .single();

  if (!unit) notFound();

  const { data: history } = await supabase
    .from("unit_history")
    .select("id, field_name, old_value, new_value, changed_at, user_profiles(full_name)")
    .eq("unit_id", id)
    .order("changed_at", { ascending: false });

  return (
    <div>
      <Link
        href={`/buildings/${unit.building_id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-2 hover:text-ink"
      >
        <ChevronLeft size={16} /> Quay lại danh sách phòng
      </Link>

      <h1 className="mb-1 font-display text-2xl font-bold text-ink">
        Lịch sử thay đổi — Phòng {unit.room_number}
      </h1>
      <p className="mb-6 text-sm text-muted-2">Chỉ ghi nhận thay đổi Giá thuê và Tình trạng.</p>

      {!history || history.length === 0 ? (
        <div className="rounded-card border-[1.5px] border-dashed border-line bg-white p-10 text-center text-sm text-muted">
          Phòng này chưa có lịch sử thay đổi nào.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border-[1.5px] border-line bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[12px] font-semibold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Người sửa</th>
                <th className="px-4 py-3">Trường</th>
                <th className="px-4 py-3">Giá trị cũ</th>
                <th className="px-4 py-3">Giá trị mới</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const changer = Array.isArray(h.user_profiles) ? h.user_profiles[0] : h.user_profiles;
                return (
                  <tr key={h.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-ink">{formatDateTime(h.changed_at)}</td>
                    <td className="px-4 py-3 text-ink">{changer?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-ink">
                      {FIELD_LABELS[h.field_name] ?? h.field_name}
                    </td>
                    <td className="px-4 py-3 text-muted-2">{formatValue(h.field_name, h.old_value)}</td>
                    <td className="px-4 py-3 text-ink">{formatValue(h.field_name, h.new_value)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
