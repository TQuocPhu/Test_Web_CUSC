import { z } from "zod";

import {
    VisualSchemaJson,
} from "./visual_schema.schema";

export const CreateTemplateStaticSchema = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề không được để trống"),

    slug: z
        .string()
        .min(1),

    shortDescription: z
        .string()
        .max(500)
        .optional(),

    fullDescription: z
        .string()
        .optional(),

    coverImage: z
        .string()
        .url()
        .optional(),

    pricingType: z
        .enum([
            "FREE",
            "PAID",
        ])
        .default("FREE"),

    price: z
        .number()
        .nonnegative()
        .default(0),

    visibility: z
        .enum([
            "PUBLIC",
            "PRIVATE",
        ])
        .default("PUBLIC"),

    tags: z.string().optional(),
});

export const UpdateTemplateVersionSchema =
    z.object({
        version: z
            .string()
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
            .number()
            .int()
            .min(0)
            .max(1)
            .default(1),
    });