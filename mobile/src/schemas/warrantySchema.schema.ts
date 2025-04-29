import * as z from "zod";

export const warrantySchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  productInfo: z.string().min(1, "Product info is required"),
  installationDate: z.string().min(1, "Installation date is required"),
  invoiceFile: z
    .object({
      uri: z.string().min(1, "Invoice file URI is required"),
      name: z.string().min(1, "Invoice file name is required"),
      type: z.string().min(1, "Invoice file type is required"),
    })
    .refine((file) => !!file.uri && !!file.name && !!file.type, {
      message: "Invoice file is required",
    }),
});

export type WarrantyFormType = z.infer<typeof warrantySchema>;
