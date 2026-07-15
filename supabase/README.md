# Supabase setup

1. Tạo project mới tại https://supabase.com/dashboard (region Singapore là gần nhất).
2. Vào **SQL Editor** → New query → dán toàn bộ nội dung [`schema.sql`](./schema.sql) → Run.
3. Vào **Project Settings → API**, copy `Project URL`, `anon public` key và `service_role` secret vào file `.env.local` ở thư mục gốc (xem `.env.local.example`). `service_role` chỉ dùng ở server, tuyệt đối không đặt tên biến có prefix `NEXT_PUBLIC_`.
4. Tạo tài khoản admin đầu tiên theo hướng dẫn ở cuối `schema.sql` (mục "Bootstrap").
5. Sau khi đăng nhập bằng admin đầu tiên, tạo và khóa/mở khóa các tài khoản tiếp theo tại `/admin/users`.

## Kiểm tra RLS nhanh sau khi setup

- Đăng nhập bằng tài khoản sale → mở DevTools → Network → gọi API `buildings` trực tiếp phải trả về mảng rỗng (không phải lỗi, không có `house_number`).
- Gọi `buildings_sale_view` hoặc RPC `search_buildings` phải trả dữ liệu nhưng `house_number` luôn là `null`.
- Đăng nhập bằng admin, mọi thứ phải đầy đủ.
