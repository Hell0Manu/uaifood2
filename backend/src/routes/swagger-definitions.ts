/**
 * @swagger
 * components:
 *   securitySchemes:
 *     # Definição de autenticação Bearer JWT
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     # ============================================================
 *     # DTOs de ENTRADA
 *     # ============================================================
 *
 *     RegisterUserDto:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - birthDate
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário.
 *           example: "Pedro Alves"
 *         email:
 *           type: string
 *           format: email
 *           description: Email único para login.
 *           example: "pedro@email.com"
 *         password:
 *           type: string
 *           format: password
 *           description: Senha com no mínimo 6 caracteres.
 *           example: "senha123"
 *         phone:
 *           type: string
 *           description: Telefone do usuário.
 *           example: "34999998888"
 *         birthDate:
 *           type: string
 *           format: date
 *           description: Data de nascimento (YYYY-MM-DD).
 *           example: "1990-10-28"
 *
 *     UpdateUserDto:
 *       type: object
 *       description: Objeto para atualização de usuário (todos os campos opcionais).
 *       properties:
 *         name:
 *           type: string
 *           example: "Pedro Alves da Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "pedro.silva@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "novaSenha123"
 *         phone:
 *           type: string
 *           example: "34999997777"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-10-29"
 *         userType:
 *           type: string
 *           enum: [CLIENT, ADMIN]
 *           description: Apenas administradores podem alterar.
 *
 *     AuthRequestDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "pedro@email.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "senha123"
 *
 *     # ============================================================
 *     # OBJETOS DE RESPOSTA
 *     # ============================================================
 *
 *     User:
 *       type: object
 *       description: Representação pública do usuário (sem senha).
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           description: ID do usuário (retornado como string).
 *           example: "1"
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         userType:
 *           type: string
 *           enum: [CLIENT, ADMIN]
 *         birthDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJyb2xlIjoiQ0xJRU5UIiwiaWF0IjoxNj..."
 *
 *     DeleteUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso.
 *           example: "Usuario deletado com sucesso"
 * 
 *     # ============================================================
 *     # RESPOSTAS PADRÃO
 *     # ============================================================
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem de erro.
 *           example: "Email ou senha inválidos"
 *
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso.
 *           example: "Logout realizado com sucesso"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     # --- DTOs de Endereço ---
 *     CreateAddressDto:
 *       type: object
 *       required: [street, number, district, city, state, zipCode]
 *       properties:
 *         street:
 *           type: string
 *           description: Nome da rua.
 *           example: "Rua das Flores"
 *         number:
 *           type: string
 *           description: Número do imóvel.
 *           example: "123"
 *         district:
 *           type: string
 *           description: Bairro.
 *           example: "Centro"
 *         city:
 *           type: string
 *           description: Cidade.
 *           example: "Uberaba"
 *         state:
 *           type: string
 *           description: Sigla do estado (UF).
 *           example: "MG"
 *         zipCode:
 *           type: string
 *           description: Código de Endereçamento Postal (CEP).
 *           example: "38000-000"
 *
 *     UpdateAddressDto:
 *       type: object
 *       description: Campos opcionais para atualização de endereço.
 *       properties:
 *         street:
 *           type: string
 *           example: "Avenida Leopoldino de Oliveira"
 *         number:
 *           type: string
 *           example: "1000"
 *         district:
 *           type: string
 *           example: "Parque do Mirante"
 *         city:
 *           type: string
 *           example: "Uberaba"
 *         state:
 *           type: string
 *           example: "MG"
 *         zipCode:
 *           type: string
 *           example: "38080-000"
 *
 *     # --- Objeto de Resposta Endereço ---
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           description: ID único do endereço.
 *           example: "10"
 *         street:
 *           type: string
 *           example: "Rua das Flores"
 *         number:
 *           type: string
 *           example: "123"
 *         district:
 *           type: string
 *           example: "Centro"
 *         city:
 *           type: string
 *           example: "Uberaba"
 *         state:
 *           type: string
 *           example: "MG"
 *         zipCode:
 *           type: string
 *           example: "38000-000"
 *         userId:
 *           type: string
 *           format: bigint
 *           description: ID do usuário dono deste endereço.
 *           example: "1"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro.
 * 
 *     # ============================================================
 *     # OBJETOS DE RESPOSTA
 *     # ============================================================
 * 
 *     DeleteAddressResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso.
 *           example: "Endereço deletado com sucesso"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     # --- DTOs de Item ---
 *     CreateItemDto:
 *       type: object
 *       required: [description, unitPrice, categoryId]
 *       properties:
 *         description:
 *           type: string
 *           example: "Coca-Cola 2L"
 *         unitPrice:
 *           type: number
 *           format: float
 *           example: 10.50
 *         categoryId:
 *           type: string
 *           format: bigint
 *           description: ID da categoria à qual o item pertence.
 *           example: "1"
 *
 *     UpdateItemDto:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           example: "Coca-Cola 2L Zero"
 *         unitPrice:
 *           type: number
 *           format: float
 *           example: 11.00
 *         categoryId:
 *           type: string
 *           format: bigint
 *           example: "2"
 *
 *     # --- Objeto de Resposta Item ---
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           example: "15"
 *         description:
 *           type: string
 *         unitPrice:
 *           type: number
 *           format: decimal
 *           description: O Prisma retorna Decimal, mas JSON serializa como número.
 *           example: 10.5
 *         categoryId:
 *           type: string
 *           format: bigint
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     # --- Objeto de Resposta Categoria ---
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           example: "1"
 *         description:
 *           type: string
 *           example: "Bebidas"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     # --- DTOs de Pedido ---
 *     CreateOrderDto:
 *       type: object
 *       required: [paymentMethod, addressId, items]
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, DEBIT_CARD, PIX, CASH]
 *           example: "PIX"
 *         addressId:
 *           type: string
 *           format: bigint
 *           description: ID do endereço de entrega.
 *           example: "1"
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItemDto'
 *
 *     OrderItemDto:
 *       type: object
 *       required: [itemId, quantity]
 *       properties:
 *         itemId:
 *           type: string
 *           format: bigint
 *           example: "15"
 *         quantity:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           example: 2
 * 
 *     UpdateOrderStatusDto:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, DELIVERED, CANCELED]
 *           example: "DELIVERED"
 *
 *     # --- Objeto de Resposta Order ---
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, DEBIT_CARD, PIX, CASH]
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, DELIVERED, CANCELED]
 *         clientId:
 *           type: string
 *           format: bigint
 *         client:
 *           $ref: '#/components/schemas/User'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemResponse'
 *
 *     OrderItemResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *         quantity:
 *           type: number
 *           format: integer
 *         orderId:
 *           type: string
 *           format: bigint
 *         itemId:
 *           type: string
 *           format: bigint
 *         item:
 *           $ref: '#/components/schemas/Item'
 *
 *     StatusOrder:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *         paymentMethod:
 *           type: string
 *           enum: [CREDIT_CARD, DEBIT_CARD, PIX, CASH]
 *         status:
 *           type: string
 *           enum: [PENDING, PROCESSING, DELIVERED, CANCELED]
 *         clientId:
 *           type: string
 *           format: bigint
 *         createdById:
 *           type: string
 *           format: bigint
 *         addressId:
 *           type: string
 *           format: bigint
 * 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     # --- DTOs de Categoria ---
 *     CreateCategoryDto:
 *       type: object
 *       required: [description]
 *       properties:
 *         description:
 *           type: string
 *           description: Nome da nova categoria #(ex: "Bebidas", "Pizzas").
 *           example: "Bebidas"
 *
 *     UpdateCategoryDto:
 *       type: object
 *       description: Campos opcionais para atualização de categoria.
 *       properties:
 *         description:
 *           type: string
 *           example: "Bebidas Alcoólicas"
 *
 *     # --- Objeto de Resposta Categoria ---
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: bigint
 *           description: ID único da categoria.
 *           example: "1"
 *         description:
 *           type: string
 *           example: "Bebidas"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do registro.
 */

