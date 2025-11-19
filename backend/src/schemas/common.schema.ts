import { z } from 'zod';

// 1. O Schema de validação para 'params'
//    Exatamente como você escreveu!
export const idParamsSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => {
      try {
        BigInt(val); // Tenta converter para BigInt
        return true;
      } catch (e) {
        return false;
      }
    }, { message: "O ID na URL deve ser um número válido (BigInt)." })
  })
});

// 2. Extrai o TIPO para usar no Controller
//    Isso cria o tipo: { id: string }
export type IdParams = z.infer<typeof idParamsSchema>['params'];