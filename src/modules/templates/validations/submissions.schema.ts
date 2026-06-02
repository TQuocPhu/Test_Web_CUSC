import { z } from "zod";

export const SubmitFormSchema = z.object({
  templateVersionId: z.number().int(),

  status: z
    .enum({ DRAFT: "DRAFT", PENDING: "PENDING" }, {
      message: "Trạng thái phiếu không hợp lệ (Chỉ chấp nhận DRAFT hoặc PENDING)",
    })
    .default("PENDING"),

  dataJson: z.record(z.string(), z.any())
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "Dữ liệu phiếu không được để trống hoàn toàn",
    }),
});