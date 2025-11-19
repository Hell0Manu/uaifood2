import type { Request, Response, NextFunction } from 'express';
import { UserType } from '@prisma/client';

/**
 * Middleware de autorização.
 * Cria um middleware que verifica se o usuário logado tem um dos papéis permitidos.
 * * @param allowedRoles Array de papéis (UserType) permitidos.
 */
export const checkRole = (allowedRoles: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Pega o 'role' que o 'authMiddleware' já validou e anexou
    const userRole = req.user.role;

    // Verifica se o papel do usuário está na lista de papéis permitidos
    if (allowedRoles.includes(userRole)) {
      // Permissão concedida
      next();
    } else {
      // Acesso negado
      res.status(403).json({ error: 'Acesso proibido. Você não tem permissão.' });
    }
  };
};