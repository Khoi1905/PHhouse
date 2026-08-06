export function formatPrice(value: number): string {
  return value.toLocaleString("vi-VN");
}

export function parsePrice(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

const DIACRITIC_MARKS = /[̀-ͯ]/g;

export function stripDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITIC_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

// Giá thuê lưu trong DB luôn là VNĐ thô (units.price_month). Các hàm dưới đây
// chỉ dùng để quy đổi hiển thị/nhập liệu sang "triệu đồng" cho gọn — không
// được dùng để đổi đơn vị lưu trữ hay giá trị gửi lên server/RPC.
export function vndToTrieuStr(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined || raw === "") return "";
  const vnd = Number(raw);
  if (!Number.isFinite(vnd)) return "";
  const trieu = Math.round((vnd / 1_000_000) * 100) / 100;
  return String(trieu);
}

// Chấp nhận cả "5.6" và "5,6": bàn phím số trên điện thoại ở VN đưa ra dấu
// PHẨY, nên người nhập gần như luôn gõ dấu phẩy. Trả null khi chưa parse được
// (chuỗi rỗng, còn dở dang, hoặc có ký tự lạ) — nơi gọi tự quyết định xử lý.
export function trieuStrToVnd(trieuStr: string): number | null {
  const normalized = trieuStr.trim().replace(/,/g, ".");
  const trieu = Number(normalized);
  if (!normalized || !Number.isFinite(trieu)) return null;
  return Math.round(trieu * 1_000_000);
}

export function parsePercent(raw?: string): number | null {
  if (!raw || !raw.trim()) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
