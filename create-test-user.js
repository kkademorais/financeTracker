const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (existingUser) {
      console.log('Usuário de teste já existe!');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Criar o usuário
    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'test@example.com',
        password: hashedPassword,
        settings: {
          create: {
            theme: 'light',
            currency: 'USD',
            notificationsEnabled: true,
          },
        },
      },
    });

    console.log('Usuário de teste criado com sucesso:', user.email);
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 