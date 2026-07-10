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

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
