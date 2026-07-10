// Phải khớp 100% với CHECK constraint trong supabase/schema.sql
export const DISTRICTS = [
  "Ba Đình", "Hoàn Kiếm", "Hai Bà Trưng", "Đống Đa", "Tây Hồ", "Cầu Giấy",
  "Thanh Xuân", "Hoàng Mai", "Long Biên", "Hà Đông", "Nam Từ Liêm", "Bắc Từ Liêm",
  "Sóc Sơn", "Đông Anh", "Gia Lâm", "Thanh Trì", "Ba Vì", "Chương Mỹ", "Đan Phượng",
  "Hoài Đức", "Mỹ Đức", "Phú Xuyên", "Phúc Thọ", "Quốc Oai", "Thạch Thất",
  "Thanh Oai", "Thường Tín", "Ứng Hòa", "Mê Linh", "Sơn Tây",
] as const;

export const UNIT_TYPES = ["Studio", "1N1K", "2N1K", "Gác xép", "Giường tầng"] as const;

export const UNIT_STATUSES = ["Trống", "Đang thuê", "Đang sửa chữa", "Ngừng cho thuê"] as const;

export const STATUS_STYLES: Record<(typeof UNIT_STATUSES)[number], { bg: string; fg: string }> = {
  "Trống": { bg: "#E8F0E5", fg: "#3E5641" },
  "Đang thuê": { bg: "#F2E9E0", fg: "#B5764A" },
  "Đang sửa chữa": { bg: "#F0E5E5", fg: "#9C4A4A" },
  "Ngừng cho thuê": { bg: "#E9E7E1", fg: "#6B6858" },
};

export type District = (typeof DISTRICTS)[number];
export type UnitType = (typeof UNIT_TYPES)[number];
export type UnitStatus = (typeof UNIT_STATUSES)[number];
