# Supabase setup

1. Tạo project mới tại https://supabase.com/dashboard (region Singapore là gần nhất).
2. Vào **SQL Editor** → New query → dán toàn bộ nội dung [`schema.sql`](./schema.sql) → Run.
3. Vào **Project Settings → API**, copy `Project URL` và `anon public` key vào file `.env.local` ở thư mục gốc (xem `.env.local.example`).
4. Tạo tài khoản admin đầu tiên theo hướng dẫn ở cuối `schema.sql` (mục "Bootstrap").
5. Tạo thêm tài khoản sale sau này bằng đúng 2 bước đó với `role = 'sale'`.

## Kiểm tra RLS nhanh sau khi setup

- Đăng nhập bằng tài khoản sale → mở DevTools → Network → gọi API `buildings` trực tiếp phải trả về mảng rỗng (không phải lỗi, không có `house_number`).
- Gọi `buildings_sale_view` hoặc RPC `search_buildings` phải trả dữ liệu nhưng `house_number` luôn là `null`.
- Đăng nhập bằng admin, mọi thứ phải đầy đủ.
