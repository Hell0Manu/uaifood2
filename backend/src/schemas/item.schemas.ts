import { z } from 'zod';
import { idParamsSchema } from './common.schema.js';

export const itemsByCategorySchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      try {
        BigInt(val);
        return true;
      } catch (e) {
        return false;
      }
    }, { message: "O ID da Categoria deve ser um número válido (BigInt)." })
  })
});

const itemBodyBase = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  // Preço unitário. Aceita número e o converte
  unitPrice: z.number().positive({ message: "O preço deve ser um número positivo" }),
  // ID da Categoria. 'coerce' converte string ou número para BigInt
  categoryId: z.coerce.bigint({ error: "categoryId deve ser um número" }),
});

const createItemBodySchema = itemBodyBase;
const updateItemBodySchema = itemBodyBase.partial(); // Todos os campos se tornam opcionais

// --- Schemas de ROTA ---
export const createItemSchema = z.object({
  body: createItemBodySchema,
});

export const updateItemSchema = idParamsSchema.merge(
  z.object({ body: updateItemBodySchema })
);

export const itemParamsSchema = idParamsSchema;

// --- Tipos para o Service ---
export type CreateItemDto = z.infer<typeof createItemBodySchema>;
export type UpdateItemDto = z.infer<typeof updateItemBodySchema>;