import { z } from "zod";

export const ElementStyleSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),

  fontSize: z.number().optional(),

  color: z.string().optional(),
});

export const DynamicTableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.string(),
});

export const FormElementSchema = z.object({
  id: z.string(),

  type: z.string(),

  fieldKey: z.string(),

  label: z.string(),

  required: z.boolean().default(false),

  style: ElementStyleSchema,

  columns: z
    .array(DynamicTableColumnSchema)
    .optional(),
});

export const TemplatePageSchema = z.object({
  id: z.string(),

  name: z.string(),

  width: z.number(),

  height: z.number(),

  background: z.string(),

  elements: z.array(FormElementSchema),
});

export const TemplateThemeSchema = z.object({
  primaryColor: z.string(),

  fontFamily: z.string(),
});

export const TemplateSettingSchema = z.object({
  allowExportPdf: z.boolean().default(true),

  allowSignature: z.boolean().default(true),

  allowQrVerify: z.boolean().default(true),

  autoSave: z.boolean().default(true),
});

export const VisualSchemaJson = z.object({
  pages: z.array(TemplatePageSchema),

  theme: TemplateThemeSchema.optional(),

  settings: TemplateSettingSchema.optional(),
});