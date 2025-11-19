import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { UserType } from "@prisma/client";
import { validate } from '../middlewares/validate.middleware.js';
import { 
  registerUserSchema, 
  loginUserSchema, 
  updateUserSchema,
  deleteUserSchema,
  viewProfileSchema
} from '../schemas/user.schema.js';

const userRouter = Router();
// Rotas públicas
userRouter.post("/register", validate(registerUserSchema), UserController.register);
userRouter.post("/login", validate(loginUserSchema), UserController.login);

// Rotas autenticadas
userRouter.post("/logout", authMiddleware, UserController.logout);
userRouter.get("/user/:id", validate(viewProfileSchema), authMiddleware, UserController.viewProfileId);
userRouter.get("/user", authMiddleware, UserController.viewMyProfile);
userRouter.delete("/user/:id", validate(deleteUserSchema), authMiddleware, UserController.deleteUser);
userRouter.put("/user/:id", validate(updateUserSchema), authMiddleware, UserController.updateProfile);

// Rota de Admin
userRouter.get(
  "/users",
  authMiddleware,
  checkRole([UserType.ADMIN]),
  UserController.listAllUsers
);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários e autenticação
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Users]
 *     description: Cria um novo usuário padrão com o papel 'CLIENT'.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Dados invalidos #(ex: email ja existe, campos faltando).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Users]
 *     description: Faz o login com email e senha e retorna um token JWT e os dados do usuário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequestDto'
 *     responses:
 *       '200':
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '401':
 *         description: Credenciais inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Faz logout do usuário (Requer autenticação)
 *     tags: [Users]
 *     description: Invalida o token JWT atual do usuário, adicionando-o à blacklist no Redis.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Token inválido ou revogado.
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Busca o perfil de um usuário pelo id (Requer autenticação)
 *     tags: [Users]
 *     description: CLIENTs só podem ver o próprio perfil. ADMINs podem ver qualquer perfil.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *         description: ID (BigInt) do usuário a ser visualizado.
 *     responses:
 *       '200':
 *         description: Perfil do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (não é o dono nem ADMIN).
 *       '404':
 *         description: Usuário não encontrado.
 *
 *   put:
 *     summary: Atualiza o perfil de um usuário (Requer autenticação)
 *     tags: [Users]
 *     description: CLIENTs só podem atualizar o próprio perfil. ADMINs podem atualizar qualquer perfil.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *         description: ID (BigInt) do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Dados inválidos ou ID mal formatado.
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (não é o dono nem ADMIN).
 *       '404':
 *         description: Usuário não encontrado.
 *
 *   delete:
 *     summary: Deleta um usuário (Requer autenticação)
 *     tags: [Users]
 *     description: CLIENTs só podem deletar o próprio perfil. ADMINs podem deletar qualquer perfil.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *         description: ID (BigInt) do usuário a ser deletado.
 *     responses:
 *       '200':
 *         description: Usuário deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (não é o dono nem ADMIN).
 *       '404':
 *         description: Usuário não encontrado.
 */

/**
 * @swagger
 * /user:
 *  get:
 *    summary: Busca o perfil do usuário autenticado (Requer autenticação)
 *    tags: [Users]
 *    description: Retorna o perfil do usuário autenticado.
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: Perfil do usuário autenticado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      '401':
 *        description: Token não fornecido.
 *      '403':
 *        description: Token inválido ou revogado.
 */

/**
 * @swagger
 * /all:
 *   get:
 *     summary: Lista TODOS os usuários (Requer ADMIN)
 *     tags: [Users]
 *     description: Retorna uma lista completa de todos os usuários no sistema. Rota restrita a usuários com papel 'ADMIN'.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso proibido. Rota de Admin.
 */


export default userRouter;
