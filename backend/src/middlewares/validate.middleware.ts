import type { Request, Response, NextFunction } from  'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { z, ZodObject, ZodError } from 'zod';

// Recebe um schema e retorna um middleware de validação
export const validate = (schema: ZodObject<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Tenta validar o 'req' (body, params, query)
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      const data = validatedData as any;

      // 2. Se for bem-sucedido, substitui os dados do 'req'
      //    pelos dados limpos e validados
      if (data.body) {
        req.body = data.body;
      }
      if (data.params) {
        req.params = data.params as ParamsDictionary;
      }
      if (data.query) {
        req.query = data.query as ParsedQs;
      }
      next(); // Passa para o próximo middleware (ou controller)
    } catch (error) {
      // 3. Se falhar, formata e retorna o erro 400
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: error.format() // Formato de erro do Zod
        });
      }
      return res.status(500).json({ error: 'Erro interno de validação' });
    }
  };