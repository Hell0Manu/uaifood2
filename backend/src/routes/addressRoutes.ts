import { Router } from "express";
import { AddressController } from "../controllers/addressController.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/checkRole.middleware.js';
import { UserType } from '@prisma/client';
import { validate } from '../middlewares/validate.middleware.js';
import { 
  createAddressSchema,
  updateAddressSchema,
  deleteAddressSchema,
  findAddressSchema 
} from '../schemas/address.schema.js';

const addressRouter = Router();

addressRouter.use(authMiddleware);


addressRouter.post('/:id/', validate(createAddressSchema), AddressController.create);

addressRouter.get('/:id/', validate(findAddressSchema), AddressController.findAllByUserId);

addressRouter.put('/:id', validate(updateAddressSchema), AddressController.update);

addressRouter.delete('/:id', validate(deleteAddressSchema), AddressController.delete);
  
addressRouter.get('/',checkRole([UserType.ADMIN]), AddressController.listAll);

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Gerenciamento de endereços de usuários
 */

/**
 * @swagger
 * /address/{id}/:
 *   post:
 *     summary: Cria um novo endereço para um usuário (Requer autenticação)
 *     tags: [Addresses]
 *     description: Cria um novo endereço associado a um usuário. ADMINs podem criar para qualquer usuário. CLIENTs só podem criar para si mesmos.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (BigInt) do **USUÁRIO** dono do novo endereço.
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddressDto'
 *     responses:
 *       '201':
 *         description: Endereço criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       '400':
 *         description: Dados inválidos (campos faltando).
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (CLIENT tentando criar para outro usuário).
 *       '404':
 *         description: Usuário não encontrado.
 *
 *   get:
 *     summary: Lista todos os endereços de um usuário (Requer autenticação)
 *     tags: [Addresses]
 *     description: Retorna uma lista de todos os endereços de um usuário específico. ADMINs podem ver de qualquer usuário. CLIENTs só podem ver os seus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (BigInt) do **USUÁRIO** para listar os endereços.
 *         example: "1"
 *     responses:
 *       '200':
 *         description: Lista de endereços (pode ser um array vazio []).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (CLIENT tentando ver endereços de outro).
 *       '404':
 *         description: Usuário não encontrado.
 */

/**
 * @swagger
 * /address/{id}:
 *   put:
 *     summary: Atualiza um endereço (Requer autenticação)
 *     tags: [Addresses]
 *     description: Atualiza um endereço específico. ADMINs podem atualizar qualquer endereço. CLIENTs só podem atualizar os seus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (BigInt) do **ENDEREÇO** a ser atualizado.
 *         example: "10"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAddressDto'
 *     responses:
 *       '200':
 *         description: Endereço atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       '400':
 *         description: Dados inválidos.
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (CLIENT tentando editar endereço de outro).
 *       '404':
 *         description: Endereço não encontrado.
 *
 *   delete:
 *     summary: Deleta um endereço (Requer autenticação)
 *     tags: [Addresses]
 *     description: Deleta um endereço específico. ADMINs podem deletar qualquer endereço. CLIENTs só podem deletar os seus.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID (BigInt) do **ENDEREÇO** a ser deletado.
 *         example: "10"
 *     responses:
 *       '200':
 *         description: Endereço deletado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteAddressResponse'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso negado (CLIENT tentando deletar endereço de outro).
 *       '404':
 *         description: Endereço não encontrado.
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lista TODOS os endereços (Requer ADMIN)
 *     tags: [Addresses]
 *     description: Retorna uma lista completa de todos os endereços no sistema. Rota restrita a usuários com papel 'ADMIN'.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de todos os endereços.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       '401':
 *         description: Token não fornecido.
 *       '403':
 *         description: Acesso proibido. Rota de Admin.
 */



export default addressRouter;