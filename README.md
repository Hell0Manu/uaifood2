# UaiFood

Plataforma digital de venda de alimentos — Projeto da disciplina **DAW II**.

## 🚀 *Rodando o Projeto*

Este guia explica como configurar e executar o ambiente de desenvolvimento utilizando **Docker**.

---

## 📦 **Pré-requisitos**

Antes de iniciar, certifique-se de ter instalado:

* **Docker**
* **Docker Compose**


## 1️⃣ Configuração do Ambiente (`.env`)

O projeto utiliza variáveis de ambiente para configurar banco de dados, autenticação e serviços adicionais.

### **1. Criar o arquivo `.env`**

```bash
cp .env.example .env
```

### **2. Preencher o `.env`**

Abra o arquivo `.env` recém-criado e complete todas as variáveis.

> **Atenção:**
> Na `DATABASE_URL`, o host deve ser o nome do serviço no Docker Compose (ex.: `db`) — **nunca `localhost`**.

Exemplo:

```env
# Banco de Dados (Docker + Prisma)
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=uaifood
DB_PORT=5433  # Porta local para acessar o banco

# Prisma (host = serviço do docker-compose)
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"

# Aplicação
SECRET_JWT="SEU_SEGREDO_FORTE_E_ALEATORIO_DE_64_CARACTERES_AQUI"

# Redis (host = serviço do docker-compose)
REDIS_URL="redis://redis:6379"

# Admin Seed
ADMIN_EMAIL="admin@uaifood.com"
ADMIN_PASSWORD="admin123"
```

---

## 2️⃣ Iniciando os Serviços

Com o `.env` configurado, inicie todos os contêineres (API, Postgres, Redis):

```bash
docker compose up -d --build
```

* **`--build`**: Reconstrói a imagem da aplicação (necessário após instalar dependências ou alterar o Dockerfile).
* **`-d`**: Executa os contêineres em segundo plano.

---

## 3️⃣ Migrações e Seed com Prisma

Assim que o banco estiver rodando, você deve preparar o esquema e inserir os dados iniciais.

Todos os comandos abaixo são executados **dentro do contêiner `app`**:

### **1. (Opcional) Formatar schema**

```bash
docker compose exec app npx prisma format
```

### **2. Rodar migrações**

```bash
docker compose exec app npx prisma migrate dev
```

> O Prisma pode solicitar um nome para a migração (ex.: `init-tables`).

### **3. Rodar o Seed**

```bash
docker compose exec app npx prisma db seed
```

Isso criará o usuário administrador padrão definido no `.env`.

---

## 4️⃣ Acessando o Banco via Prisma Studio

O Prisma Studio permite visualizar e editar os dados do banco diretamente.

> **Importante:** Execute este comando **no seu computador (host)**, **não** dentro do contêiner.

```bash
npx prisma studio
```

O `DATABASE_URL` do seu `.env` deve apontar para:

```
postgresql://admin:admin123@localhost:${DB_PORT}/uaifood
```

Se ocorrer erro, verifique:

* A porta (`DB_PORT`) está mapeada no `docker-compose.yml`
* O Postgres está rodando

---

## 5️⃣ Acessando a API

A API do UaiFood ficará disponível em:

👉 **[http://localhost:3001](http://localhost:3001)**

Rotas principais:

* **POST** `/register`
* **POST** `/login`
* **GET** `/user` (necessário token JWT)
* **DELETE** `/user` (necessário token JWT)
* **PUT** `/user` (necessário token JWT)

---

## 6️⃣ Comandos Úteis do Docker

### **Ver logs da aplicação**

```bash
docker compose logs -f app
```

### **Parar todos os contêineres**

```bash
docker compose down
```

### **Parar e remover volumes (reset total do banco)**

```bash
docker compose down -v
```

