"use client";

import { useFormContext } from "react-hook-form";
import { Field, TextInput, LockedInput, Select, Textarea } from "@/components/ui";
import { DISTRICTS } from "@/lib/constants";
import type { WizardFormValues } from "@/lib/validation";

export function BuildingFields() {
  const { register } = useFormContext<WizardFormValues>();

  return (
    <>
      <Field label="Quận / Huyện" required hint="Sale lọc được theo trường này">
        <Select options={DISTRICTS} {...register("district")} />
      </Field>
      <Field label="Phường / Xã" hint="Sale lọc được theo trường này">
        <TextInput placeholder="Dịch Vọng Hậu" {...register("ward")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Ngõ / Ngách" hint="Sale nhìn thấy được — dùng để định vị khu vực chung">
          <TextInput placeholder="Ngõ 12, ngách 5, đường Trần Duy Hưng" {...register("alley")} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label="Số nhà cụ thể" locked hint="Ẩn khỏi mọi tài khoản sale">
          <LockedInput placeholder="Số 8" {...register("houseNumber")} />
        </Field>
      </div>

      <Field label="Tên người dẫn" locked hint="Ẩn khỏi mọi tài khoản sale">
        <LockedInput placeholder="Nguyễn Văn B" {...register("guideName")} />
      </Field>
      <Field label="Số dẫn" locked hint="SĐT người dẫn sale đi xem phòng — ẩn khỏi sale">
        <LockedInput placeholder="0912 345 678" {...register("guidePhone")} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Ghi chú tòa nhà" hint="Đặc điểm chung của tòa, không bắt buộc">
          <Textarea rows={2} placeholder="Ghi chú..." {...register("buildingNote")} />
        </Field>
      </div>
    </>
  );
}
