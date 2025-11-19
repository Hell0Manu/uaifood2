import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../configs/jwt.config.js';
import redisClient from '../configs/redis.client.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Pega o cabeçalho "Authorization"
  const authHeader = req.headers['authorization'];
  
  // 2. Extrai o token (ex: "Bearer eyJ...")
  const token = authHeader && authHeader.split(' ')[1];

  // 3. Se não há token, barra o usuário
  if (token == null) {
    return res.status(401).json({ error: 'Token de acesso não fornecido.' });
  }

  try {
    // 4. Verifica se o token está no Redis
    const isBlacklisted = await redisClient.get(token);
    if(isBlacklisted){
      throw new Error('Token inválido ou revogado.');
    }

    // 5. Verifica se o token é válido
    const payload = verifyToken(token);

    // 6. ANEXA o ID do usuário ao 'req' para uso futuro
    req.user = {
      id: BigInt(payload.id),
      role: payload.role,
    };

    // 7. Deixa a requisição passar
    next();
  } catch (error) {
    // 8. Se o token for inválido ou expirado, barra o usuário
    let errorMessage = error instanceof Error ? error.message : 'Token inválido ou expirado.' 

    return res.status(403).json({ error: errorMessage });
  }
};