import { Phone, ExternalLink, MessageCircle } from "lucide-react";
import { SUPPORT_CONTACT, RECRUIT_CONTACT } from "@/lib/contact";

// Footer công khai cho trang đăng nhập — nơi duy nhất người CHƯA có tài khoản
// (ứng viên CTV, người cần hỗ trợ) chạm tới hệ thống, vì app không có tự đăng ký.
export function ContactFooter() {
  return (
    <div className="mt-2 flex flex-col items-center gap-2.5 text-center text-[13px] text-muted-2">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5">
          <Phone size={14} className="flex-shrink-0" />
          Hỗ trợ:
        </span>
        <a href={`tel:${SUPPORT_CONTACT.phone}`} className="inline-flex items-center gap-1 hover:text-ink">
          {SUPPORT_CONTACT.phoneDisplay} – {SUPPORT_CONTACT.name}
        </a>
        <a
          href={RECRUIT_CONTACT.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-ink"
        >
          <ExternalLink size={14} /> Facebook
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <span>Đăng ký cộng tác viên:</span>
        <a
          href={RECRUIT_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-ink"
        >
          <MessageCircle size={14} /> Zalo
        </a>
      </div>
    </div>
  );
}
