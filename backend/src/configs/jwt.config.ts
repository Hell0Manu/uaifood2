import jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

const JWT_SECRET = process.env.SECRET_JWT;

if (!JWT_SECRET) {
  throw new Error('Variável de ambiente SECRET_JWT não definida.');
}

/**
 * Gera um token JWT para um usuário.
 * @param userId ID do usuário (bigint)
 */
export const generateToken = (userId: bigint, role: UserType): string => {
  const idString = userId.toString();

  return jwt.sign(
    { id: idString, role: role }, // O "payload" do token
    JWT_SECRET,       // O segredo
    { expiresIn: '1h' } // Tempo de expiração
  );
};

/**
 * Verifica um token JWT e retorna o payload.
 * @param token O token JWT
 */
export const verifyToken = (token: string): { id: string; role: UserType } & jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: UserType } & jwt.JwtPayload;
};