"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Link as LinkIcon } from "lucide-react";
import { Field, TextInput, Select, Textarea, StatusPicker } from "@/components/ui";
import { UNIT_TYPES } from "@/lib/constants";
import type { WizardFormValues } from "@/lib/validation";

export function UnitFields() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<WizardFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        <Field label="Số phòng" required hint='vd "203" — không cần nhập tầng riêng'>
          <TextInput placeholder="203" {...register("roomNumber")} />
        </Field>
        <Field label="Loại phòng" required>
          <Select options={UNIT_TYPES} {...register("unitType")} />
        </Field>

        <Field label="Giá thuê / tháng (VNĐ)" required hint="Dùng để sale lọc theo khoảng giá">
          <TextInput
            type="number"
            min={0}
            placeholder="7500000"
            {...register("priceMonth", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Tình trạng" required>
          <Controller
            control={control}
            name="status"
            render={({ field }) => <StatusPicker value={field.value} onChange={field.onChange} />}
          />
        </Field>
      </div>

      {errors.roomNumber && <p className="-mt-3 mb-3 text-xs text-[#9C4A4A]">{errors.roomNumber.message as string}</p>}
      {errors.priceMonth && <p className="-mt-3 mb-3 text-xs text-[#9C4A4A]">{errors.priceMonth.message as string}</p>}

      <Field
        label="Thông tin chi tiết"
        hint="Điền tự do: diện tích, nội thất, tiện ích, giá dịch vụ (điện/nước/internet/gửi xe...) và các mô tả khác"
      >
        <Textarea
          rows={6}
          placeholder={
            "Ví dụ:\nDiện tích: 35m2\nNội thất: đầy đủ (điều hòa, giường, tủ lạnh, máy giặt chung)\nTiện ích: ban công, thang máy, bảo vệ 24h\nGiá dịch vụ: điện 3.500đ/kWh, nước 100.000đ/người, internet 100.000đ/phòng, gửi xe 300.000đ/xe máy"
          }
          {...register("detailsText")}
        />
      </Field>

      <Field label="Link folder ảnh Google Drive" hint="Dán link folder chứa toàn bộ ảnh của phòng này">
        <div className="flex items-center gap-2 rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 focus-within:border-moss">
          <LinkIcon size={15} className="text-muted" />
          <input
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-placeholder"
            {...register("gdriveFolderLink")}
          />
        </div>
      </Field>
      {errors.gdriveFolderLink && (
        <p className="-mt-3 mb-3 text-xs text-[#9C4A4A]">{errors.gdriveFolderLink.message as string}</p>
      )}

      <Field label="Ghi chú nội bộ" hint="Ghi chú riêng cho admin/sale khi tư vấn">
        <Textarea rows={2} placeholder="Ghi chú..." {...register("unitNote")} />
      </Field>
    </>
  );
}
