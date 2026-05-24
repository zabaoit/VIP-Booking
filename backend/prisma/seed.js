import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Initializing seed data...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'danhduong@gmail.com' },
    update: {},
    create: {
      email: 'danhduong@gmail.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('✅ Sample accounts seeded successfully:');
  console.log(' - Admin:', admin.email);
  console.log(' - User:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Error during data seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });