import { z } from "zod";

import {
  ElementStyleSchema,
  DynamicTableColumnSchema,
  FormElementSchema,
  TemplatePageSchema,
  VisualSchemaJson,
} from "../validations/visual_schema.schema";

export type ElementStyle =
  z.infer<typeof ElementStyleSchema>;

export type DynamicTableColumn =
  z.infer<typeof DynamicTableColumnSchema>;

export type FormElement =
  z.infer<typeof FormElementSchema>;

export type TemplatePage =
  z.infer<typeof TemplatePageSchema>;

export type VisualSchema =
  z.infer<typeof VisualSchemaJson>;