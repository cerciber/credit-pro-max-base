import { z } from 'zod';

export const customerQuerySchema = z.object({
  govIssueIdentType: z.string().min(1),
  identSerialNum: z.string().min(1),
  value: z.string().min(1),
});

export const customerAlreadyExistsSchema = z.object({
  ResponseType: z.object({
    value: z.string().min(1),
  }),
  ResponseDetail: z.object({
    ErrorCode: z.string().min(1),
    ErrorDesc: z.string().min(1),
    ErrorType: z.string().min(1),
  }),
});

export type CustomerQuery = z.infer<typeof customerQuerySchema>;
export type CustomerAlreadyExistsResponse = z.infer<
  typeof customerAlreadyExistsSchema
>;
