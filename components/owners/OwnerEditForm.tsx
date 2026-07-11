"use client";

import { useForm } from "react-hook-form";
import { Field, TextInput, LockedInput, Textarea, Button } from "@/components/ui";
import { ownerEditSchema, type OwnerEditValues } from "@/lib/validation";

export function OwnerEditForm({
  defaultValues,
  onSubmit,
  onCancel,
  pending,
  error,
}: {
  defaultValues: OwnerEditValues;
  onSubmit: (values: OwnerEditValues) => void;
  onCancel: () => void;
  pending: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerEditValues>({ defaultValues });

  function submit(values: OwnerEditValues) {
    const parsed = ownerEditSchema.safeParse(values);
    if (!parsed.success) return;
    onSubmit(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        <Field label="Mã chủ" required>
          <TextInput {...register("ownerCode")} />
        </Field>
        <Field label="Họ và tên" required>
          <TextInput {...register("fullName")} />
        </Field>
        <Field label="Số điện thoại chính" required>
          <TextInput {...register("phone")} />
        </Field>
        <Field label="Số điện thoại phụ">
          <TextInput {...register("phoneSecondary")} />
        </Field>
        <Field label="Email">
          <TextInput {...register("email")} />
        </Field>
        <Field label="Số tài khoản ngân hàng">
          <TextInput {...register("bankAccount")} />
        </Field>
        <Field label="Số CMND/CCCD">
          <TextInput {...register("idNumber")} />
        </Field>

        <Field label="Hoa hồng cho sale (%)" hint="Sale xem được">
          <TextInput type="number" step="0.1" min={0} max={100} {...register("commissionSalePct")} />
        </Field>
        <Field label="Hoa hồng tổng (%)" locked hint="Ẩn khỏi mọi tài khoản sale">
          <LockedInput type="number" step="0.1" min={0} max={100} {...register("commissionTotalPct")} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Ghi chú nội bộ">
            <Textarea rows={3} {...register("ownerNote")} />
          </Field>
        </div>
      </div>

      {(errors.ownerCode || errors.fullName || errors.phone || errors.email) && (
        <p className="mb-3 text-xs text-[#9C4A4A]">Vui lòng kiểm tra lại các trường bắt buộc.</p>
      )}
      {(errors.commissionSalePct || errors.commissionTotalPct) && (
        <p className="mb-3 text-xs text-[#9C4A4A]">% hoa hồng phải là số từ 0 đến 100.</p>
      )}
      {error && <p className="mb-3 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="save" disabled={pending}>
          {pending ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
