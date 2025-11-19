import { z } from 'zod';
import { idParamsSchema } from './common.schema.js';

export const createAddressSchema = z.object({
  body: z.object({
    street: z.string()
      .min(1, { message: "Rua é obrigatório" }),
      
    number: z.string()
        .min(1, { message: "Número é obrigatório" }),
    
    district: z.string()
      .min(1, { message: "Bairro é obrigatório" }),
    
    city: z.string()
      .min(1, { message: "Cidade é obrigatório" }),
    
    state: z.string()
        .min(1, { message: "Estado é obrigatório" }),
    zipCode: z.string()
      .min(1, { message: "CEP é obrigatório" })
      .max(10, { message: "CEP deve ter no máximo 10 caracteres" }),
  }).strict() // Não permite campos extras no body
}).merge(idParamsSchema);

export const updateAddressSchema = z.object({
  body: z.object({
    street: z.string()
      .min(1, { message: "Rua é obrigatório" })
      .optional(),
      
    number: z.string()
        .min(1, { message: "Número é obrigatório" })
        .optional(),
    
    district: z.string()
      .min(1, { message: "Bairro é obrigatório" })
      .optional(),
    
    city: z.string()
      .min(1, { message: "Cidade é obrigatório" })
      .optional(),
    
    state: z.string()
        .min(1, { message: "Estado é obrigatório" })
        .optional(),
    zipCode: z.string()
      .min(1, { message: "CEP é obrigatório" })
      .max(10, { message: "CEP deve ter no máximo 10 caracteres" })
      .optional(),
  }).strict() // Não permite campos extras no body
}).merge(idParamsSchema);

export const deleteAddressSchema = idParamsSchema;
export const findAddressSchema = idParamsSchema;
export type CreateAddressDto = z.infer<typeof createAddressSchema>['body'];
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>['body'];