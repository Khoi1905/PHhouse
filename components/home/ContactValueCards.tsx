"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, UserPlus, ExternalLink, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui";
import { SUPPORT_CONTACT, RECRUIT_CONTACT } from "@/lib/contact";

export function ContactValueCards() {
  const [openModal, setOpenModal] = useState<"support" | "recruit" | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenModal("support")}
        className="rounded-card border-[1.5px] border-line bg-white p-5 text-left transition-colors hover:border-moss"
      >
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-orange text-white">
          <Phone size={18} strokeWidth={2.2} />
        </div>
        <h3 className="font-display text-base font-semibold text-ink">Hỗ trợ chi tiết</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-2">
          Cần giúp đỡ khi dùng hệ thống? Xem thông tin liên hệ hỗ trợ.
        </p>
      </button>

      <button
        type="button"
        onClick={() => setOpenModal("recruit")}
        className="rounded-card border-[1.5px] border-line bg-white p-5 text-left transition-colors hover:border-moss"
      >
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[9px] bg-brand-orange text-white">
          <UserPlus size={18} strokeWidth={2.2} />
        </div>
        <h3 className="font-display text-base font-semibold text-ink">Đăng ký cộng tác viên</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-2">
          Giới thiệu người quen tham gia đội ngũ cộng tác viên PH House.
        </p>
      </button>

      <Modal open={openModal === "support"} title="Hỗ trợ chi tiết" onClose={() => setOpenModal(null)}>
        <p className="text-sm text-muted-2">Gặp khó khăn khi sử dụng hệ thống? Liên hệ trực tiếp:</p>
        <div className="mt-4 flex items-center gap-3 rounded-card border-[1.5px] border-line bg-paper p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
            <Phone size={18} strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-ink">{SUPPORT_CONTACT.name}</p>
            <a
              href={`tel:${SUPPORT_CONTACT.phone}`}
              className="text-sm font-semibold text-moss hover:underline"
            >
              {SUPPORT_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
        <a
          href={RECRUIT_CONTACT.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 flex items-center gap-2.5 rounded-card border-[1.5px] border-line bg-paper p-3.5 text-sm font-semibold text-ink transition-colors hover:border-moss"
        >
          <ExternalLink size={18} className="text-brand-orange" /> Facebook
        </a>
      </Modal>

      <Modal open={openModal === "recruit"} title="Đăng ký cộng tác viên" onClose={() => setOpenModal(null)}>
        <p className="text-sm text-muted-2">
          Tham gia cộng đồng cộng tác viên PH House qua nhóm Zalo, hoặc quét mã QR bên dưới.
        </p>
        <a
          href={RECRUIT_CONTACT.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2.5 rounded-card border-[1.5px] border-line bg-paper p-3.5 text-sm font-semibold text-ink transition-colors hover:border-moss"
        >
          <MessageCircle size={18} className="text-brand-orange" /> Nhóm Zalo cộng tác viên
        </a>
        <div className="mt-4 flex justify-center">
          <Image
            src={RECRUIT_CONTACT.qrImage}
            alt="Mã QR nhóm Zalo cộng tác viên PH House"
            width={220}
            height={330}
            className="rounded-card border-[1.5px] border-line"
          />
        </div>
      </Modal>
    </>
  );
}
