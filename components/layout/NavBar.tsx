"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { signOut } from "@/app/login/actions";
import type { CurrentProfile } from "@/lib/supabase/profile";
import { Logo } from "./Logo";

export function NavBar({ profile }: { profile: CurrentProfile }) {
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/buildings" className="hover:text-brand-orange" onClick={() => setOpen(false)}>
        Tra cứu phòng
      </Link>
      {profile.role === "admin" && (
        <>
          <Link href="/owners" className="hover:text-brand-orange" onClick={() => setOpen(false)}>
            Chủ sở hữu
          </Link>
          <Link href="/admin/overview" className="hover:text-brand-orange" onClick={() => setOpen(false)}>
            Bảng tổng hợp
          </Link>
          <Link
            href="/admin/new-entry"
            className="text-brand-orange hover:text-brand-orange-dark"
            onClick={() => setOpen(false)}
          >
            + Thêm mới
          </Link>
        </>
      )}
    </>
  );

  const userInfo = (
    <div>
      <p className="text-sm font-semibold text-ink">{profile.fullName ?? "—"}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {profile.role === "admin" ? "Admin" : "Sale"}
      </p>
    </div>
  );

  const logoutButton = (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-field border border-line px-3 py-1.5 text-[13px] font-semibold text-muted-2 hover:border-ink hover:text-ink"
      >
        Đăng xuất
      </button>
    </form>
  );

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-8">
          <Logo size="sm" />
          <nav className="hidden items-center gap-5 text-sm font-semibold text-muted-2 md:flex">
            {navLinks}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {userInfo}
          {logoutButton}
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-field border border-line text-ink md:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-muted-2">{navLinks}</nav>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            {userInfo}
            {logoutButton}
          </div>
        </div>
      )}
    </header>
  );
}
