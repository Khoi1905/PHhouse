"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-field bg-ink py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState<{ error: string | null }, FormData>(signIn, {
    error: null,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-clay">
            CHDV
          </p>
          <h1 className="font-display text-3xl font-bold text-ink">Đăng nhập</h1>
          <p className="mt-2 text-sm text-muted-2">
            Hệ thống quản lý &amp; tra cứu căn hộ dịch vụ
          </p>
        </div>

        <form action={formAction} className="space-y-4 rounded-card border border-line bg-white p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[12.5px] font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="ban@email.com"
              className="w-full rounded-field border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-placeholder focus:border-moss"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[12.5px] font-semibold text-ink">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-field border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-placeholder focus:border-moss"
            />
          </div>

          {state.error && (
            <p className="rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
