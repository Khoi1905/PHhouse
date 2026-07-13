import { Phone, ExternalLink, MessageCircle } from "lucide-react";
import { SUPPORT_CONTACT, RECRUIT_CONTACT } from "@/lib/contact";

// Footer công khai cho trang đăng nhập — nơi duy nhất người CHƯA có tài khoản
// (ứng viên CTV, người cần hỗ trợ) chạm tới hệ thống, vì app không có tự đăng ký.
// Thứ tự cố ý: CTV (nổi bật nhất, CTA chính) -> Hỗ trợ -> Facebook page.
export function ContactFooter() {
  return (
    <div className="mt-2 flex flex-col items-center gap-3 text-center">
      <a
        href={RECRUIT_CONTACT.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-field border-[1.5px] border-brand-orange bg-white px-4 py-2.5 text-[13.5px] font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
      >
        <MessageCircle size={16} className="flex-shrink-0" />
        Đăng ký Cộng tác viên ngay để tra cứu nguồn hàng không giới hạn
      </a>

      <a
        href={`tel:${SUPPORT_CONTACT.phone}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-2 hover:text-ink"
      >
        <Phone size={14} className="flex-shrink-0" />
        Hỗ trợ: {SUPPORT_CONTACT.phoneDisplay} – {SUPPORT_CONTACT.name}
      </a>

      <a
        href={RECRUIT_CONTACT.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-2 hover:text-ink"
      >
        <ExternalLink size={14} className="flex-shrink-0" />
        Facebook: {RECRUIT_CONTACT.facebookPageName}
      </a>
    </div>
  );
}
