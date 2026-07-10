"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import type { ZodError } from "zod";
import { User, Building2, Home, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { SectionCard, Stepper, Button, type Step } from "@/components/ui";
import { OwnerFields } from "./OwnerFields";
import { BuildingFields } from "./BuildingFields";
import { UnitFields } from "./UnitFields";
import {
  ownerNewSchema,
  ownerExistingSchema,
  buildingStepSchema,
  unitStepSchema,
  type WizardFormValues,
  type FullEntryFormValues,
} from "@/lib/validation";
import { createFullEntry } from "@/app/(app)/admin/new-entry/actions";

const STEPS: Step[] = [
  { id: "owner", label: "Chủ sở hữu", icon: User },
  { id: "building", label: "Tòa nhà", icon: Building2 },
  { id: "unit", label: "Phòng", icon: Home },
];

export function NewEntryWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetOwnerId = searchParams.get("ownerId");
  const presetOwnerLabel = searchParams.get("ownerLabel");

  const [step, setStep] = useState(presetOwnerId ? 1 : 0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const methods = useForm<WizardFormValues>({
    defaultValues: presetOwnerId
      ? {
          mode: "existing",
          ownerId: presetOwnerId,
          ownerCode: presetOwnerLabel ?? "",
          status: "Trống",
        }
      : { mode: "new", status: "Trống" },
  });
  const { handleSubmit, getValues, setError, clearErrors, watch } = methods;

  function applyErrors(zodError: ZodError) {
    zodError.issues.forEach((issue) => {
      const path = issue.path[0] as keyof WizardFormValues;
      setError(path, { message: issue.message });
    });
  }

  function goNext() {
    const values = getValues();
    clearErrors();
    if (step === 0) {
      const schema = values.mode === "existing" ? ownerExistingSchema : ownerNewSchema;
      const result = schema.safeParse(values);
      if (!result.success) return applyErrors(result.error);
    } else if (step === 1) {
      const result = buildingStepSchema.safeParse(values);
      if (!result.success) return applyErrors(result.error);
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function onSubmit(values: WizardFormValues) {
    clearErrors();
    const result = unitStepSchema.safeParse(values);
    if (!result.success) return applyErrors(result.error);

    setSubmitError(null);
    startTransition(async () => {
      const res = await createFullEntry(values as unknown as FullEntryFormValues);
      if (!res.ok) {
        setSubmitError(res.error);
        return;
      }
      router.push(`/buildings/${res.buildingId}`);
    });
  }

  const ownerCode = watch("ownerCode");
  const ownerLabel = watch("mode") === "existing" ? ownerCode : ownerCode;
  const district = watch("district");
  const ward = watch("ward");

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-orange">
          PH HOUSE · Nhập liệu căn hộ
        </p>
        <h1 className="font-display text-3xl font-bold text-ink">Thêm mới vào hệ thống</h1>
        <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted-2">
          Dữ liệu được lưu theo 3 lớp lồng nhau — Chủ sở hữu chứa Tòa nhà, Tòa nhà chứa Phòng. Tòa
          nhà không cần mã riêng, được định danh trực tiếp bằng địa chỉ.
        </p>
      </div>

      <Stepper steps={STEPS} current={step} onStepClick={setStep} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <SectionCard depth={0} title="Chủ sở hữu" subtitle="Thông tin người sở hữu tòa nhà / bất động sản" icon={User}>
              <OwnerFields />
            </SectionCard>
          )}

          {step === 1 && (
            <SectionCard
              depth={1}
              title="Tòa nhà"
              subtitle={ownerLabel ? `Thuộc chủ sở hữu: ${ownerLabel}` : undefined}
              icon={Building2}
            >
              <BuildingFields />
            </SectionCard>
          )}

          {step === 2 && (
            <SectionCard
              depth={2}
              title="Phòng"
              subtitle={district ? `Thuộc tòa nhà tại: ${district}, ${ward ?? ""}` : undefined}
              icon={Home}
            >
              <UnitFields />
            </SectionCard>
          )}

          {submitError && (
            <p className="mb-4 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">
              {submitError}
            </p>
          )}

          <div className="fixed inset-x-0 bottom-0 mx-auto flex max-w-2xl items-center justify-between border-t border-line bg-paper/95 px-6 py-3.5 backdrop-blur">
            <Button
              type="button"
              variant="ghost"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ChevronLeft size={16} /> Quay lại
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" variant="primary" onClick={goNext}>
                Tiếp tục <ChevronRight size={16} />
              </Button>
            ) : (
              <Button type="submit" variant="save" disabled={pending}>
                <Check size={16} /> {pending ? "Đang lưu..." : "Lưu căn hộ"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
