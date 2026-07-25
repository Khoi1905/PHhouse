// Phải khớp 100% với CHECK constraint trong supabase/schema.sql
export const DISTRICTS = [
  "Ba Đình", "Hoàn Kiếm", "Hai Bà Trưng", "Đống Đa", "Tây Hồ", "Cầu Giấy",
  "Thanh Xuân", "Hoàng Mai", "Long Biên", "Hà Đông", "Nam Từ Liêm", "Bắc Từ Liêm",
  "Sóc Sơn", "Đông Anh", "Gia Lâm", "Thanh Trì", "Ba Vì", "Chương Mỹ", "Đan Phượng",
  "Hoài Đức", "Mỹ Đức", "Phú Xuyên", "Phúc Thọ", "Quốc Oai", "Thạch Thất",
  "Thanh Oai", "Thường Tín", "Ứng Hòa", "Mê Linh", "Sơn Tây",
] as const;

export const UNIT_TYPES = ["Studio", "1N1K", "2N1K", "Gác xép", "Giường tầng", "Đơn-VSC"] as const;

export const ACCESS_TYPES = ["Thang máy", "Thang bộ"] as const;

export const UNIT_STATUSES = ["Trống", "Full", "Giữa tháng trống", "Cuối tháng trống"] as const;

// 3 trạng thái được tính là "trống" trong số đếm ở /buildings (sale có thể tư vấn ngay).
export const VACANT_STATUSES: readonly string[] = ["Trống", "Giữa tháng trống", "Cuối tháng trống"];

export const STATUS_STYLES: Record<(typeof UNIT_STATUSES)[number], { bg: string; fg: string }> = {
  "Trống": { bg: "#E8F0E5", fg: "#3E5641" },
  "Full": { bg: "#F2E9E0", fg: "#B5764A" },
  "Giữa tháng trống": { bg: "#E3EBF2", fg: "#3D6690" },
  "Cuối tháng trống": { bg: "#EFE7F5", fg: "#6B4C96" },
};

export const USER_ROLES = ["admin", "sale"] as const;

// Sắp xếp cho view "theo phòng" (search_units) — không chọn thì giữ nguyên
// thứ tự mặc định (khớp loại phòng nhiều hơn lên trước, rồi quận/ngõ/số phòng).
export const UNIT_SORT_OPTIONS = [
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "commission_asc", label: "Hoa hồng: Thấp → Cao" },
  { value: "commission_desc", label: "Hoa hồng: Cao → Thấp" },
] as const;

export type District = (typeof DISTRICTS)[number];
export type UnitType = (typeof UNIT_TYPES)[number];
export type UnitStatus = (typeof UNIT_STATUSES)[number];
export type AccessType = (typeof ACCESS_TYPES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type UnitSortBy = (typeof UNIT_SORT_OPTIONS)[number]["value"];
