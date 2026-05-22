import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Nạp biến môi trường từ file .env
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Đọc chuỗi kết nối trực tiếp từ file .env
    url: process.env.DATABASE_URL,
  },
});