import { z } from "zod";

import {
  SubmitFormSchema,
} from "../validations/submissions.schema";

export type SubmitFormInput =
  z.infer<typeof SubmitFormSchema>;


// response example
export interface SubmissionResponse {
  id: number;

  submissionCode: string;

  status: string;

  createdAt: Date;
}