import { UserType } from '@prisma/client';
import prisma from "./prismaClient.js"
import { hash } from 'bcryptjs';


async function main() {
  console.log('Iniciando o script de seed...');

  // Pega as credenciais do .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Variáveis de ambiente ADMIN_EMAIL ou ADMIN_PASSWORD não definidas.'
    );
  }

  // Hasheia a senha
  const hashedPassword = await hash(adminPassword, 10);

  // 'upsert' é um comando mágico:
  // - Tenta encontrar um usuário pelo 'email'.
  // - Se encontrar, ele 'update' (não faz nada aqui).
  // - Se NÃO encontrar, ele 'create'.
  // Isso garante que você nunca crie admins duplicados.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Não faz nada se o admin já existir
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin UaiFood',
      phone: '000000000',
      userType: UserType.ADMIN,
      birthDate: new Date(),
    },
  });

  console.log(`Usuário admin criado/verificado: ${admin.email}`);

  // --- 2. CRIAÇÃO DAS CATEGORIAS ---
  console.log('Criando categorias...');
  const lanches = await prisma.category.upsert({
    where: { description: 'Lanches' },
    update: {},
    create: {
      description: 'Lanches',
    },
  });

  const bebidas = await prisma.category.upsert({
    where: { description: 'Bebidas' },
    update: {},
    create: {
      description: 'Bebidas',
    },
  });

  const sobremesas = await prisma.category.upsert({
    where: { description: 'Sobremesas' },
    update: {},
    create: {
      description: 'Sobremesas',
    },
  });
  console.log('Categorias criadas/verificadas: Lanches, Bebidas, Sobremesas.');

  // --- 3. CRIAÇÃO DOS ITENS ---
  console.log('Criando itens...');

  // Lanches
  await prisma.item.upsert({
    where: { description: 'X-Salada Clássico' },
    update: {},
    create: {
      description: 'X-Salada Clássico',
      unitPrice: 18.5,
      category: {
        connect: { id: lanches.id }, // Conecta ao ID da categoria 'Lanches'
      },
    },
  });

  await prisma.item.upsert({
    where: { description: 'X-Bacon Duplo' },
    update: {},
    create: {
      description: 'X-Bacon Duplo',
      unitPrice: 24.0,
      category: {
        connect: { id: lanches.id },
      },
    },
  });

  // Bebidas
  await prisma.item.upsert({
    where: { description: 'Coca-Cola Lata 350ml' },
    update: {},
    create: {
      description: 'Coca-Cola Lata 350ml',
      unitPrice: 6.0,
      category: {
        connect: { id: bebidas.id }, // Conecta ao ID da categoria 'Bebidas'
      },
    },
  });

  // Sobremesas
  await prisma.item.upsert({
    where: { description: 'Pudim de Leite Condensado' },
    update: {},
    create: {
      description: 'Pudim de Leite Condensado',
      unitPrice: 8.5,
      category: {
        connect: { id: sobremesas.id }, // Conecta ao ID da categoria 'Sobremesas'
      },
    },
  });

  console.log('Itens criados/verificados.');
  console.log('Seed finalizado com sucesso!');
}

// Executa a função e fecha a conexão
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });