import { z } from "zod";

import {
    VisualSchemaJson,
} from "./visual_schema.schema";

// export const CreateTemplateStaticSchema = z.object({
//     title: z
//         .string()
//         .min(1, "Tiêu đề không được để trống")
//         .max(150, "Tiêu đề không được vượt quá 150 ký tự"),

//     slug: z
//         .string()
//         .min(1, "Slug định danh không được để trống"),


//     shortDescription: z
//         .string()
//         .max(500, "Mô tả ngắn không được vượt quá 500 ký tự")
//         .optional(),

//     fullDescription: z
//         .string()
//         .optional(),

//     coverImage: z
//         .string()
//         .url("Đường dẫn ảnh bìa không đúng định dạng URL")
//         .optional()
//         .or(z.literal("")),

//     pricingType: z
//         .enum(["FREE", "PAID"], {
//             error: () => ({ message: "Hình thức tính phí không hợp lệ (FREE hoặc PAID)" }),
//         })
//         .default("FREE"),

//     price: z
//         .number({ message: "Giá tiền phải là một số" })
//         .nonnegative("Giá tiền không được là số âm")
//         .default(0),

//     visibility: z
//         .enum(["PUBLIC", "PRIVATE"], {
//             error: () => ({ message: "Trạng thái hiển thị không hợp lệ (PUBLIC hoặc PRIVATE)" }),
//         })
//         .default("PUBLIC"),

//     tags: z.string().optional(),
// }).refine((data) => {
//         if (data.pricingType === "PAID" && data.price <= 0) {
//             return false;
//         }
//         return true;
//     }, {
//         message: "Nếu biểu mẫu có phí (PAID), giá tiền phải lớn hơn 0",
//         path: ["price"], // Chỉ định lỗi trả về ở trường price
//     });

export const BaseTemplateStaticObject = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề không được để trống")
        .max(150, "Tiêu đề không được vượt quá 150 ký tự"),

    slug: z
        .string()
        .min(1, "Slug định danh không được để trống"),

    shortDescription: z
        .string()
        .max(500, "Mô tả ngắn không được vượt quá 500 ký tự")
        .optional(),

    fullDescription: z
        .string()
        .optional(),

    coverImage: z
        .string()
        .url("Đường dẫn ảnh bìa không đúng định dạng URL")
        .optional()
        .or(z.literal("")),

    pricingType: z
        .enum(["FREE", "PAID"], {
            error: () => ({ message: "Hình thức tính phí không hợp lệ (FREE hoặc PAID)" }),
        })
        .default("FREE"),

    price: z
        .number({ message: "Giá tiền phải là một số" })
        .max(2000000000, "Giá tiền không được vượt quá 2 tỷ đồng")
        .nonnegative("Giá tiền không được là số âm")
        .default(0),

    visibility: z
        .enum(["PUBLIC", "PRIVATE"], {
            error: () => ({ message: "Trạng thái hiển thị không hợp lệ (PUBLIC hoặc PRIVATE)" }),
        })
        .default("PUBLIC"),

    tags: z.string().optional(),
});

// 2. Thằng Create cũ giữ nguyên logic bằng cách kế thừa lại Base Object và gắn thêm refine
export const CreateTemplateStaticSchema = BaseTemplateStaticObject.refine((data) => {
    if (data.pricingType === "PAID" && data.price <= 0) {
        return false;
    }
    return true;
}, {
    message: "Nếu biểu mẫu có phí (PAID), giá tiền phải lớn hơn 0",
    path: ["price"],
});

export const UpdateTemplateVersionSchema =
    z.object({
        version: z
            .string()
            .trim()
            .regex(/^\d+\.\d+\.\d+$/, "Phiên bản phải tuân theo định dạng Semantic Versioning (Ví dụ: 1.0.0)")
            .default("1.0.0"),

        schemaJson: VisualSchemaJson,

        description: z
            .string()
            .optional(),

        instructions: z
            .string()
            .optional(),

        requiredDocuments: z
            .string()
            .optional(),

        changeLogs: z
            .string()
            .optional(),

        isPublished: z
            .number({ message: "Trạng thái xuất bản phải là số (0 hoặc 1)" })
            .int()
            .min(0, "Trạng thái xuất bản không hợp lệ")
            .max(1, "Trạng thái xuất bản không hợp lệ")
            .default(1),
    });

export const UpdateTemplateComboSchema = BaseTemplateStaticObject.partial().extend({
    schemaJson: VisualSchemaJson.optional(),
    versionDescription: z.string().optional(), // Mô tả cho phiên bản mới (nếu có)
});