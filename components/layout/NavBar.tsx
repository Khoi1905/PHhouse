import Link from "next/link";
import { signOut } from "@/app/login/actions";
import type { CurrentProfile } from "@/lib/supabase/profile";

export function NavBar({ profile }: { profile: CurrentProfile }) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="font-display text-lg font-bold text-ink">CHDV</span>
          <nav className="flex items-center gap-5 text-sm font-semibold text-muted-2">
            <Link href="/buildings" className="hover:text-ink">
              Tra cứu phòng
            </Link>
            {profile.role === "admin" && (
              <>
                <Link href="/owners" className="hover:text-ink">
                  Chủ sở hữu
                </Link>
                <Link href="/admin/new-entry" className="hover:text-ink">
                  + Thêm mới
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-ink">{profile.fullName ?? "—"}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {profile.role === "admin" ? "Admin" : "Sale"}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-field border border-line px-3 py-1.5 text-[13px] font-semibold text-muted-2 hover:border-ink hover:text-ink"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
