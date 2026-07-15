// Skeleton mặc định cho mọi trang trong route group (app) chưa có loading.tsx
// riêng — Next.js hiện cái này NGAY khi bấm chuyển trang, trước khi
// getCurrentProfile()/RPC chạy xong, để màn hình phản hồi tức thì thay vì
// đứng im. Chỉ là hiệu ứng chờ, không thay đổi tốc độ tải dữ liệu thật.
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="mb-3 h-8 w-56 rounded-field bg-line/60" />
        <div className="h-4 w-80 max-w-full rounded-field bg-line/40" />
      </div>
      <div className="mb-6 h-16 rounded-card border-[1.5px] border-line bg-white" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-card border-[1.5px] border-line bg-white p-5">
            <div className="mb-3 h-9 w-9 rounded-[9px] bg-line/50" />
            <div className="mb-2 h-4 w-3/4 rounded-field bg-line/60" />
            <div className="h-3 w-full rounded-field bg-line/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
