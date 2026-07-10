import { z } from "zod";
import { DISTRICTS, UNIT_TYPES, UNIT_STATUSES, type District, type UnitType, type UnitStatus } from "./constants";

export const ownerNewSchema = z.object({
  mode: z.literal("new"),
  ownerCode: z.string().min(1, "Bắt buộc"),
  fullName: z.string().min(1, "Bắt buộc"),
  phone: z.string().min(1, "Bắt buộc"),
  phoneSecondary: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  bankAccount: z.string().optional(),
  idNumber: z.string().optional(),
  ownerNote: z.string().optional(),
});

export const ownerEditSchema = z.object({
  ownerCode: z.string().min(1, "Bắt buộc"),
  fullName: z.string().min(1, "Bắt buộc"),
  phone: z.string().min(1, "Bắt buộc"),
  phoneSecondary: z.string().optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  bankAccount: z.string().optional(),
  idNumber: z.string().optional(),
  ownerNote: z.string().optional(),
});
export type OwnerEditValues = z.infer<typeof ownerEditSchema>;

export const ownerExistingSchema = z.object({
  mode: z.literal("existing"),
  ownerId: z.string().uuid("Vui lòng chọn chủ sở hữu"),
});

export const ownerStepSchema = z.discriminatedUnion("mode", [ownerNewSchema, ownerExistingSchema]);
export type OwnerStepValues = z.infer<typeof ownerStepSchema>;

export const buildingStepSchema = z.object({
  district: z.enum(DISTRICTS, { error: "Vui lòng chọn quận/huyện" }),
  ward: z.string().optional(),
  alley: z.string().optional(),
  houseNumber: z.string().optional(),
  buildingNote: z.string().optional(),
});
export type BuildingStepValues = z.infer<typeof buildingStepSchema>;

export const unitStepSchema = z.object({
  roomNumber: z.string().min(1, "Bắt buộc"),
  unitType: z.enum(UNIT_TYPES, { error: "Vui lòng chọn loại phòng" }),
  priceMonth: z.coerce.number({ error: "Giá không hợp lệ" }).positive("Giá phải lớn hơn 0"),
  status: z.enum(UNIT_STATUSES),
  detailsText: z.string().optional(),
  gdriveFolderLink: z.string().url("Link không hợp lệ").optional().or(z.literal("")),
  unitNote: z.string().optional(),
});
export type UnitStepValues = z.infer<typeof unitStepSchema>;

export const fullEntrySchema = z.intersection(
  z.intersection(ownerStepSchema, buildingStepSchema),
  unitStepSchema
);
export type FullEntryFormValues = z.infer<typeof fullEntrySchema>;

/**
 * Flat, all-optional shape backing the react-hook-form instance across all
 * 3 wizard steps (RHF handles a single flat shape far better than a
 * discriminated union with conditionally-required fields). Converted to the
 * strict FullEntryFormValues shape via fullEntrySchema.safeParse on submit.
 */
export type WizardFormValues = {
  mode: "new" | "existing";
  ownerId?: string;
  ownerCode?: string;
  fullName?: string;
  phone?: string;
  phoneSecondary?: string;
  email?: string;
  bankAccount?: string;
  idNumber?: string;
  ownerNote?: string;
  district?: District;
  ward?: string;
  alley?: string;
  houseNumber?: string;
  buildingNote?: string;
  roomNumber?: string;
  unitType?: UnitType;
  priceMonth?: number;
  status: UnitStatus;
  detailsText?: string;
  gdriveFolderLink?: string;
  unitNote?: string;
};
