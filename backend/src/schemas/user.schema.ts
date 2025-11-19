import { z } from 'zod';
import { idParamsSchema } from './common.schema.js';

// 1. Schema para o Registro (POST /register)
export const registerUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, { message: "Nome é obrigatório" })
      .max(50, { message: "Nome deve ter no máximo 50 caracteres" }),
    email: z.string()
      .min(1, { message: "E-mail é obrigatório" })
      .email({ message: "Email inválido" }),
    
    password: z.string()
      .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
    
    phone: z.string()
      .min(1, { message: "Telefone é obrigatório" }),
    
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento deve estar no formato YYYY-MM-DD" }),
  }).strict() // Não permite campos extras no body
});

// 2. Schema para o Login (POST /login)
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string()
      .min(1, { message: "E-mail é obrigatório" })
      .email({ message: "Email inválido" }),
    
    password: z.string()
      .min(1, { message: "Senha é obrigatória" })
  }).strict()
});

// 3. Schema para o Update (PUT /user/:id)
// Todos os campos são opcionais, mas se existirem, são validados.
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string()
      .max(50, { message: "Nome deve ter no máximo 50 caracteres" })
      .optional(),
    
    email: z.string()
      .email({ message: "Email inválido" })
      .optional(),
    
    password: z.string()
      .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
      .optional(),
    
    phone: z.string().optional(),
    
    birthDate: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento deve estar no formato YYYY-MM-DD" })
      .optional(),
    
    userType: z.enum(['CLIENT', 'ADMIN']).optional() // Protege contra valores inválidos
  }).strict()
}).merge(idParamsSchema);

// 4. Exporta os TIPOS para nossos DTOs
export const deleteUserSchema = idParamsSchema;
export const viewProfileSchema = idParamsSchema;
export type RegisterUserDto = z.infer<typeof registerUserSchema>['body'];
export type authenticateUserDto = z.infer<typeof loginUserSchema>['body'];
export type UpdateUserDto = z.infer<typeof updateUserSchema>['body'];