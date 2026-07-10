"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Home, Check, ChevronLeft } from "lucide-react";
import { SectionCard, Button } from "@/components/ui";
import { UnitFields } from "./UnitFields";
import { unitStepSchema, type WizardFormValues } from "@/lib/validation";
import { createUnit } from "@/app/(app)/buildings/[id]/new-unit/actions";

export function NewUnitForm({ buildingId, buildingLabel }: { buildingId: string; buildingLabel: string }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const methods = useForm<WizardFormValues>({
    defaultValues: { mode: "new", status: "Trống" },
  });
  const { handleSubmit, setError, clearErrors } = methods;

  function onSubmit(values: WizardFormValues) {
    clearErrors();
    const result = unitStepSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof WizardFormValues, { message: issue.message });
      });
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      const res = await createUnit(buildingId, values);
      if (!res.ok) {
        setSubmitError(res.error);
        return;
      }
      router.push(`/buildings/${buildingId}`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl pb-24">
      <button
        type="button"
        onClick={() => router.push(`/buildings/${buildingId}`)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-2 hover:text-ink"
      >
        <ChevronLeft size={16} /> Quay lại danh sách phòng
      </button>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SectionCard depth={0} title="Thêm phòng" subtitle={`Thuộc tòa nhà tại: ${buildingLabel}`} icon={Home}>
            <UnitFields />
          </SectionCard>

          {submitError && (
            <p className="mb-4 rounded-field bg-danger-bg px-3 py-2 text-[13px] text-danger-fg">
              {submitError}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="save" disabled={pending}>
              <Check size={16} /> {pending ? "Đang lưu..." : "Lưu phòng"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
