import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createOrderSchema,
  orderParamsSchema,
  updateOrderStatusSchema,
} from '../schemas/order.schemas.js';

const orderRouter = Router();


orderRouter.use(authMiddleware);

orderRouter.post('/', validate(createOrderSchema), OrderController.create);
orderRouter.get('/', OrderController.findAll);
orderRouter.get('/:id', validate(orderParamsSchema), OrderController.findById);
orderRouter.patch(
  '/status/:id', 
  validate(updateOrderStatusSchema), 
  OrderController.updateStatus
);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido (carrinho)
 *     tags: [Orders]
 *     description: Cria um novo pedido para o usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *     responses:
 *       '201':
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Erro de validação (itens faltando, endereço inválido, etc)
 *       '401':
 *         description: Não autorizado
 *       '404':
 *         description: Endereço ou Item não encontrado
 *
 *   get:
 *     summary: Lista todos os pedidos do usuário logado
 *     tags: [Orders]
 *     description: Retorna o histórico de pedidos do usuário (ou todos, se for ADMIN).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de pedidos (pode ser um array vazio)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       '401':
 *         description: Não autorizado
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido específico por ID
 *     tags: [Orders]
 *     description: Retorna os detalhes de um pedido. CLIENTs só podem ver os seus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (BigInt) do pedido.
 *     responses:
 *       '200':
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Acesso negado
 *       '404':
 *         description: Pedido não encontrado
 */

/**
 * @swagger
 * /orders/status/{id}/:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Orders]
 *     description: Atualiza o status. ADMINs podem definir qualquer status. CLIENTs apenas DELIVERED ou CANCELED.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusDto'
 *     responses:
 *       '200':
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusOrder'
 *       '401':
 *         description: Não autorizado
 *       '403':
 *         description: Acesso negado ou transição de status inválida para o perfil
 *       '404':
 *         description: Pedido não encontrado
 */


export default orderRouter;