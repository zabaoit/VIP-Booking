import { PrismaClient } from '@prisma/client';

// Khởi tạo sạch sẽ, Prisma sẽ tự động nạp chuỗi kết nối từ file .env thông qua schema
const prisma = new PrismaClient();

export default prisma;