import { z } from "zod";

import {
  CreateTemplateStaticSchema,
  UpdateTemplateComboSchema,
  UpdateTemplateVersionSchema,
} from "../validations/templates.schema";

export type CreateTemplateStaticInput =
  z.infer<typeof CreateTemplateStaticSchema>;

export type UpdateTemplateVersionInput =
  z.infer<typeof UpdateTemplateVersionSchema>;


  export type UpdateTemplateComboInput = z.infer<typeof UpdateTemplateComboSchema>;

// business entity
export interface Template {
  id: number;

  title: string;

  slug: string;

  shortDescription?: string | null;

  fullDescription?: string | null;

  coverImage?: string | null;

  pricingType: "FREE" | "PAID";

  price: number;

  visibility: "PUBLIC" | "PRIVATE";
}