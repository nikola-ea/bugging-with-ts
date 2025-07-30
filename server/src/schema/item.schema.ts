import { z } from "zod";

export const CreateItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().nonnegative().min(1)
});

export const UpdateItemSchema = z.object({
  quantity: z.number().nonnegative().min(1)
});

export const itemSchema = CreateItemSchema.extend({
  id: z.uuid(),
  lastUpdated: z.date()
});

export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;
export type Item = z.infer<typeof itemSchema>;