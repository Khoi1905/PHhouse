// Skeleton riêng cho /buildings — khớp hình dạng thật (tiêu đề, khối lọc,
// bảng) để không bị giật layout khi dữ liệu tải xong. Ghi đè skeleton chung
// ở app/(app)/loading.tsx vì route con luôn ưu tiên loading.tsx gần nhất.
export default function BuildingsLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 h-7 w-44 rounded-field bg-line/60" />
          <div className="h-4 w-56 rounded-field bg-line/40" />
        </div>
      </div>

      <div className="mb-6 h-40 rounded-card border-[1.5px] border-line bg-white" />

      <div className="overflow-hidden rounded-card border-[1.5px] border-line bg-white">
        <div className="border-b border-line bg-paper/60 px-4 py-3">
          <div className="h-3 w-full rounded-field bg-line/40" />
        </div>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-0">
            <div className="h-4 w-1/4 rounded-field bg-line/50" />
            <div className="h-4 w-1/6 rounded-field bg-line/30" />
            <div className="h-4 w-1/6 rounded-field bg-line/30" />
            <div className="h-4 w-1/5 rounded-field bg-line/30" />
          </div>
        ))}
      </div>
    </div>
  );
}
