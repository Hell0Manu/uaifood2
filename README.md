# 🍔 UaiFood - Delivery App

O **UaiFood** é uma plataforma completa de delivery de comida, composta por uma interface moderna para clientes e um painel administrativo robusto para gerenciamento de pedidos, produtos e entregas.

## **🚀 Funcionalidades**

### **👤 Cliente**

- **Autenticação**: Login e Registro de usuários.

- **Cardápio**: Visualização de produtos por categorias com imagens.

- **Carrinho**: Adição/remoção de itens e cálculo de total.

- **Checkout**: Finalização de pedidos com escolha de endereço.

- **Meus Pedidos**: Histórico de pedidos com status em tempo real.

- **Perfil**: Gerenciamento de dados pessoais e endereços.

### **🛠️ Administrador (Painel)**

- **Dashboard**: Visão geral de vendas e pedidos ativos.

- **Gestão de Pedidos**: Visualizar detalhes e alterar status (Pendente -> Em Preparo -> Entregue).

- **Gestão de Produtos**: Criar, editar e excluir itens do cardápio (com URL de imagem).

- **Gestão de Categorias**: Organizar o cardápio.

- **Gestão de Usuários**: Visualizar e gerenciar clientes cadastrados.

## **🛠️ Tecnologias Utilizadas**

### **Frontend**

- **Next.js 15** (App Router)

- **TypeScript**

- **Tailwind CSS**

- **Shadcn UI** (Componentes visuais)

- **Zustand** (Gerenciamento de estado global)

- **Axios** (Requisições HTTP)

- **Sonner** (Notificações Toast)

### **Backend**

- **Node.js** com **Express**

- **TypeScript**

- **Prisma ORM**

- **PostgreSQL** (Banco de Dados)

- **JWT** (Autenticação)

- **Bcrypt** (Criptografia de senhas)

- **Swagger** (Documentação da API)

## **⚙️ Configuração e Instalação**

### **Pré-requisitos**

- [Node.js](https://nodejs.org/) (v18+)

- [Docker](https://www.docker.com/) e Docker Compose (Recomendado para o banco de dados)

### **1. Clonar o Repositório**
```bash
git clone [https://github.com/seu-usuario/uaifood.git](https://github.com/seu-usuario/uaifood.git)

cd uaifood
```
### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta **`backend/`** com o seguinte conteúdo:

```env
# ===============================
# Banco de Dados (PostgreSQL)
# ===============================
# ➡️ Se usar Docker Compose: troque "localhost" por "db"
# ➡️ Se rodar Prisma localmente: mantenha "localhost"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uaifood?schema=public"

# ===============================
# JWT (Autenticação)
# ===============================
# Gere uma chave forte! (ex: use https://generate-secret.vercel.app/32)
JWT_SECRET="sua_chave_secreta_super_segura_aqui"

# ===============================
# Porta do Servidor
# ===============================
PORT=3001

### **3. Rodar com Docker (Recomendado)**

A maneira mais fácil de rodar tudo (Frontend, Backend e Banco) é usando o Docker Compose.
```bash
docker-compose up --build
```

*O backend estará em *`http://localhost:3001`* e o frontend em *`http://localhost:3000`*.*

### **4. Rodar Manualmente (Desenvolvimento)**

Se preferir rodar cada serviço separadamente:

#### **A. Banco de Dados**

Suba apenas o banco de dados com Docker:
```bash
docker-compose up -d db
```

#### **B. Backend**
```bash
cd backend

npm install

# Criar as tabelas no banco
npx prisma migrate dev --name init

# Popular o banco com dados iniciais (Admin, Categorias e Produtos)
npx prisma db seed

# Rodar o servidor
npm run dev
```

*Acesse a documentação da API em: *`http://localhost:3001/api-docs`

#### **C. Frontend**

```bash
cd frontend

npm install

npm run dev
```

*Acesse o app em: *`http://localhost:3000`

## **📝 Scripts Úteis (Backend)**

- `npx prisma studio`: Abre uma interface visual para ver o banco de dados.

- `npx prisma migrate dev`: Cria uma nova migração se você alterar o `schema.prisma`.

- `npx prisma db seed`: Popula o banco com dados de teste.

## **🔐 Acesso Admin Padrão (Seed)**

Ao rodar o comando de seed (`npx prisma db seed`), um usuário administrador é criado automaticamente:

- **Email**: `admin@uaifood.com`

- **Senha**: `123456`
