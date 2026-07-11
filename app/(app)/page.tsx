import { redirect } from "next/navigation";
import { Zap, Database, ShieldCheck, History, type LucideIcon } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { Logo } from "@/components/layout/Logo";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";

type ValueProp = { icon: LucideIcon; title: string; description: string; adminOnly?: boolean };

const VALUE_PROPS: ValueProp[] = [
  {
    icon: Zap,
    title: "Tra cứu tức thì",
    description: "Lọc theo quận/huyện, giá, loại phòng chỉ trong vài giây.",
  },
  {
    icon: Database,
    title: "Dữ liệu tập trung",
    description: "Toàn bộ tòa nhà, phòng, chủ sở hữu quản lý ở một hệ thống duy nhất.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật theo vai trò",
    description: "Sale tư vấn khách đầy đủ thông tin mà không lộ dữ liệu nhạy cảm của chủ nhà.",
  },
  {
    icon: History,
    title: "Lưu vết mọi thay đổi",
    description: "Giá và tình trạng phòng đều được ghi lại lịch sử, biết rõ ai sửa khi nào.",
    adminOnly: true,
  },
];

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";
  const visibleValueProps = VALUE_PROPS.filter((v) => !v.adminOnly || isAdmin);

  return (
    <div>
      <div className="mb-8 text-center sm:text-left">
        <Logo size="lg" className="mb-4 justify-center sm:justify-start" />
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Chào mừng trở lại, {profile.fullName ?? "bạn"}!
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-2 sm:mx-0 sm:text-[15px]">
          Toàn bộ tòa nhà, phòng và chủ sở hữu ở một nơi — tra cứu tức thì, cập nhật theo thời gian
          thực, đúng những gì vai trò của bạn được xem.
        </p>
      </div>

      <div className="mb-10">
        <HomeSearchBar />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleValueProps.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="rounded-card border-[1.5px] border-line bg-white p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-orange text-white">
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">{v.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-2">{v.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
