import { Router } from "express";
import { ItemController } from "../controllers/itemController.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { UserType } from '@prisma/client';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createItemSchema,
  updateItemSchema,
  itemParamsSchema,
  itemsByCategorySchema,
} from '../schemas/item.schemas.js';

const itemRouter = Router();


itemRouter.get('/', ItemController.findAll);

itemRouter.get(
  '/:id',
  validate(itemParamsSchema),
  ItemController.findById
);

itemRouter.get(
  '/category/:id',
  validate(itemsByCategorySchema),
  ItemController.findAllByCategoryId
);

itemRouter.post(
  '/',
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(createItemSchema),
  ItemController.create
);
    
itemRouter.put(
  '/:id',
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(updateItemSchema),
  ItemController.update
);

itemRouter.delete(
  '/:id',
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(itemParamsSchema),
  ItemController.delete
);




/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Gerenciamento dos itens do cardápio
 */

// --- ROTAS PÚBLICAS (Ver o cardápio) ---

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Lista todos os itens do cardápio
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: Lista de todos os itens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Busca um item específico por ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Detalhes do item
 *       404:
 *         description: Item não encontrado
 */

/**
 * @swagger
 * /items/category/{id}:
 *   get:
 *     summary: Lista todos os itens de uma categoria específica
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Lista de itens da categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: Categoria não encontrada
 */

// --- ROTAS DE ADMIN (Gerenciar o cardápio) ---

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Cria um novo item (Requer ADMIN)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateItemDto'
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido (Não é ADMIN)
 *       404:
 *         description: Categoria não encontrada
 *       409:
 *         description: Item com essa descrição já existe
 */

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Atualiza um item (Requer ADMIN)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemDto'
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       404:
 *         description: Item ou Categoria não encontrado(a)
 *       409:
 *         description: Item com essa descrição já existe
 */

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Deleta um item (Requer ADMIN)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item
 *     responses:
 *       200:
 *         description: Item deletado com sucesso
 *       404:
 *         description: Item não encontrado
 *       409:
 *         description: Conflito (Item está em uso em um pedido)
 */



export default itemRouter;