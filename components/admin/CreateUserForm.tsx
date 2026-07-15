"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, TextInput, Select, Button } from "@/components/ui";
import { USER_ROLES } from "@/lib/constants";
import { createUserSchema, type CreateUserValues } from "@/lib/validation";

export function CreateUserForm({
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  onSubmit: (values: CreateUserValues) => void | Promise<void>;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: "", password: "", fullName: "", role: "sale" },
  });

  async function submit(values: CreateUserValues) {
    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Field label="Email" required error={errors.email?.message}>
        <TextInput
          type="email"
          autoComplete="off"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>
      <Field label="Mật khẩu" hint="Tối thiểu 6 ký tự" required error={errors.password?.message}>
        <TextInput
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
      </Field>
      <Field label="Họ và tên" required error={errors.fullName?.message}>
        <TextInput aria-invalid={!!errors.fullName} {...register("fullName")} />
      </Field>
      <Field label="Vai trò" required error={errors.role?.message}>
        <Select
          options={USER_ROLES}
          placeholder="— Chọn vai trò —"
          aria-invalid={!!errors.role}
          {...register("role")}
        />
      </Field>

      {error && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Hủy
        </Button>
        <Button type="submit" variant="save" disabled={pending}>
          {pending ? "Đang tạo..." : "Tạo tài khoản"}
        </Button>
      </div>
    </form>
  );
}
