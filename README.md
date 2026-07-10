# CHDV — Quản lý & tra cứu căn hộ dịch vụ

Next.js 14 (App Router) + TypeScript + Supabase (Postgres/Auth/RLS) + Tailwind CSS.

## Setup

1. Cài dependency: `npm install`
2. Làm theo [`supabase/README.md`](./supabase/README.md) để tạo project Supabase, chạy `supabase/schema.sql`, và tạo tài khoản admin đầu tiên.
3. Copy `.env.local.example` thành `.env.local`, điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. `npm run dev` → http://localhost:3000

## Cấu trúc chính

- `supabase/schema.sql` — toàn bộ schema, RLS, trigger audit log, view/RPC ẩn `house_number` khỏi sale.
- `lib/constants.ts` — danh sách quận/huyện, loại phòng, trạng thái (phải khớp CHECK constraint trong schema).
- `lib/validation.ts` — Zod schema cho các form.
- `components/ui/` — design system tái sử dụng từ mockup (Field, TextInput, LockedInput, SectionCard, StatusPill...).
- `app/(app)/` — các trang sau đăng nhập (buildings, owners, admin).

## Vai trò

- **admin**: toàn quyền nhập liệu, sửa/xóa, xem `house_number`, xuất Excel, xem lịch sử giá/tình trạng.
- **sale**: chỉ tra cứu `/buildings`, `/buildings/:id` — không thấy `house_number`, không có quyền ghi (chặn ở RLS, không chỉ ở giao diện).

## Deploy

Deploy trên Vercel như bình thường cho Next.js App Router; nhớ khai báo 2 biến môi trường ở trên trong Vercel Project Settings.
