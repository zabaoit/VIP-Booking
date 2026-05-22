import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Đang khởi tạo dữ liệu mẫu...');

  // 1. Mã hóa băm mật khẩu "123456" đúng chuẩn bảo mật
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 2. Insert tài khoản Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // 3. Insert tài khoản Khách hàng (User) mẫu
  const user = await prisma.user.upsert({
    where: { email: 'danhduong@gmail.com' },
    update: {},
    create: {
      email: 'danhduong@gmail.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('✅ Đã insert tài khoản mẫu thành công:');
  console.log(' - Admin:', admin.email);
  console.log(' - User:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi insert dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });