import { z } from 'zod';
import { idParamsSchema } from './common.schema.js';

export const createCategorySchema = z.object({
  body: z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
  }).strict()
});

export const updateCategorySchema = z.object({
  body: z.object({
    description: z.string().min(1, "Descrição é obrigatória").optional(),
  }).strict()
}).merge(idParamsSchema);


export const categoryParamsSchema = idParamsSchema;

export type CreateCategoryDto = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>['body'];