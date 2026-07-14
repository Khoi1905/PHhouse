import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, History, type LucideIcon } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { Logo } from "@/components/layout/Logo";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { ContactValueCards } from "@/components/home/ContactValueCards";

type ValueProp = { icon: LucideIcon; title: string; description: string; href?: string };

const FIRST_VALUE_PROP: ValueProp = {
  icon: Zap,
  title: "Tìm đúng phòng, thật nhanh",
  description: "Thu hẹp nguồn phòng theo khu vực, loại phòng và ngân sách chỉ trong vài thao tác.",
  href: "/buildings?view=units",
};

// Chỉ admin thấy — gate bằng isAdmin && ở JSX bên dưới.
const LAST_VALUE_PROP: ValueProp = {
  icon: History,
  title: "Mọi cập nhật đều rõ ràng",
  description: "Theo dõi lịch sử giá và tình trạng phòng để luôn nắm đúng nguồn dữ liệu mới nhất.",
};

function ValuePropCard({ prop }: { prop: ValueProp }) {
  const Icon = prop.icon;
  const content = (
    <>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-orange text-white">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <h3 className="font-display text-base font-semibold text-ink">{prop.title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-2">{prop.description}</p>
    </>
  );

  if (prop.href) {
    return (
      <Link
        href={prop.href}
        className="rounded-card border-[1.5px] border-line bg-white p-5 text-left transition-colors hover:border-moss"
      >
        {content}
      </Link>
    );
  }

  return <div className="rounded-card border-[1.5px] border-line bg-white p-5">{content}</div>;
}

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  return (
    <div>
      <div className="mb-8 text-center sm:text-left">
        <Logo size="lg" className="mb-4 justify-center sm:justify-start" />
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Chào {profile.fullName ?? "bạn"}, hôm nay bạn muốn tìm căn nào?
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-2 sm:mx-0 sm:text-[15px]">
          Tra cứu nguồn phòng nhanh, xem đúng thông tin theo vai trò và tiếp tục công việc từ một
          nơi duy nhất.
        </p>
      </div>

      <div className="mb-10">
        <HomeSearchBar />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ValuePropCard prop={FIRST_VALUE_PROP} />
        <ContactValueCards />
        {isAdmin && <ValuePropCard prop={LAST_VALUE_PROP} />}
      </div>
    </div>
  );
}
