import { z } from "zod";
import { idParamsSchema } from "./common.schema.js";

const orderItemSchema = z.object({
  itemId: z.coerce.bigint({ error: "itemId deve ser um número" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantidade deve ser positiva" }),
});

export const createOrderSchema = z.object({
  body: z.object({
    paymentMethod: z.enum(["CREDIT", "DEBIT", "PIX", "CASH"], {
      error: "Método de pagamento inválido",
    }),
    addressId: z.coerce.bigint({ error: "addressId deve ser um número" }),
    items: z
      .array(orderItemSchema)
      .min(1, "O pedido deve ter pelo menos um item"),
    clientId: z.coerce.bigint().optional(),
  }),
});

export const updateOrderStatusSchema = idParamsSchema.extend({
  body: z
    .object({
      status: z.enum(["PENDING", "PROCESSING", "DELIVERED", "CANCELED"], {
        error: "Status inválido.",
      }),
    })
    .strict(),
});

export const orderParamsSchema = idParamsSchema;

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>["body"];
export type CreateOrderDto = z.infer<typeof createOrderSchema>["body"];
export type OrderItemDto = z.infer<typeof orderItemSchema>;
