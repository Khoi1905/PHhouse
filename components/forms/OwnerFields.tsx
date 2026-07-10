"use client";

import { useFormContext } from "react-hook-form";
import { Field, TextInput, Textarea } from "@/components/ui";
import { OwnerCombobox } from "./OwnerCombobox";
import type { WizardFormValues } from "@/lib/validation";

export function OwnerFields() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WizardFormValues>();

  const mode = watch("mode");
  const ownerId = watch("ownerId");

  return (
    <>
      <div className="span-2 mb-5 flex gap-2 sm:col-span-2">
        <button
          type="button"
          onClick={() => setValue("mode", "new")}
          className={`rounded-field border-[1.5px] px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "new" ? "border-moss bg-moss text-paper" : "border-line text-muted-2"
          }`}
        >
          Chủ mới
        </button>
        <button
          type="button"
          onClick={() => setValue("mode", "existing")}
          className={`rounded-field border-[1.5px] px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "existing" ? "border-moss bg-moss text-paper" : "border-line text-muted-2"
          }`}
        >
          Chủ có sẵn
        </button>
      </div>

      {mode === "existing" ? (
        <div className="sm:col-span-2">
          <Field label="Chọn chủ sở hữu" required hint="Tìm theo mã chủ hoặc tên">
            <OwnerCombobox
              value={ownerId ? { id: ownerId, label: watch("ownerCode") ?? "" } : null}
              onChange={(owner) => {
                setValue("ownerId", owner?.id ?? "");
                setValue("ownerCode", owner?.label ?? "");
              }}
            />
          </Field>
          {errors.ownerId && (
            <p className="-mt-3 mb-4 text-xs text-[#9C4A4A]">{errors.ownerId.message as string}</p>
          )}
        </div>
      ) : (
        <>
          <Field label="Mã chủ" required hint="Tự sinh hoặc nhập tay, vd OW014">
            <TextInput placeholder="OW014" {...register("ownerCode")} />
          </Field>
          <Field label="Họ và tên" required>
            <TextInput placeholder="Nguyễn Văn A" {...register("fullName")} />
          </Field>
          <Field label="Số điện thoại chính" required>
            <TextInput placeholder="0912 345 678" {...register("phone")} />
          </Field>
          <Field label="Số điện thoại phụ">
            <TextInput placeholder="Không bắt buộc" {...register("phoneSecondary")} />
          </Field>
          <Field label="Email">
            <TextInput placeholder="owner@email.com" {...register("email")} />
          </Field>
          <Field label="Số tài khoản ngân hàng" hint="Phục vụ đối soát ở giai đoạn sau">
            <TextInput placeholder="Không bắt buộc" {...register("bankAccount")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Ghi chú nội bộ" hint="Tính cách, yêu cầu đặc biệt, lịch sử làm việc...">
              <Textarea rows={3} placeholder="Ghi chú..." {...register("ownerNote")} />
            </Field>
          </div>
        </>
      )}
    </>
  );
}
