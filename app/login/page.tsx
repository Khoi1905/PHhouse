"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "./actions";
import { Logo } from "@/components/layout/Logo";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-field bg-brand-orange py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-50"
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
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" className="mb-4 flex-col gap-2" />
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
