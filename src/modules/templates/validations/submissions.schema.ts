import { z } from "zod";

export const SubmitFormSchema = z.object({
  templateVersionId: z.number().int(),

  status: z
    .enum([
      "DRAFT",
      "PENDING",
    ])
    .default("PENDING"),

  dataJson: z.record(z.string(), z.any()),
});