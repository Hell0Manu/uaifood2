import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.middleware.js";
import { UserType } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from "../schemas/category.schema.js";

const categoryRouter = Router();
const categoryRoutes = Router();

categoryRoutes.get("/", CategoryController.findAll);

categoryRoutes.get(
  "/:id",
  validate(categoryParamsSchema),
  CategoryController.findById
);

categoryRoutes.post(
  "/",
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(createCategorySchema),
  CategoryController.create
);

categoryRoutes.put(
  "/:id",
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(updateCategorySchema),
  CategoryController.update
);

categoryRoutes.delete(
  "/:id",
  authMiddleware,
  checkRole([UserType.ADMIN]),
  validate(categoryParamsSchema),
  CategoryController.delete
);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     responses:
 *       '200':
 *         description: Lista de categorias
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Busca uma categoria por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Detalhes da categoria
 *       '404':
 *         description: Categoria não encontrada
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria (Requer ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDto'
 *     responses:
 *       '200':
 *         description: Categoria atualizada
 *       '404':
 *         description: Categoria não encontrada
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria (Requer ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       '201':
 *         description: Categoria criada
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Acesso proibido (Não é ADMIN)
 *       '409':
 *         description: Conflito (Descrição já existe)
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria (Requer ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Categoria deletada
 *       '404':
 *         description: Categoria não encontrada
 *       '409':
 *         description: Conflito (Categoria em uso por itens)
 */

export default categoryRouter;
