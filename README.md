# VIP Booking

VIP Booking là demo ứng dụng đặt phòng khách sạn cao cấp, gồm frontend React/Vite và backend Express tối giản. Frontend hiện tập trung vào trải nghiệm đặt phòng, quản lý hồ sơ khách, thanh toán mô phỏng và dashboard quản trị.

## Tính năng chính

- Giao diện client: trang chủ, danh sách phòng, chi tiết phòng, đặt phòng, xác nhận, thanh toán và trạng thái thanh toán.
- Giao diện auth: đăng nhập, đăng ký, quên mật khẩu, OTP và đặt lại mật khẩu.
- Giao diện profile: thông tin cá nhân, lịch sử đặt phòng, phương thức thanh toán và đổi mật khẩu.
- Giao diện admin: dashboard, booking, room types, services, pricing và customers.
- Dark mode/light mode đồng bộ trên client và admin.
- Dữ liệu demo lưu bằng `localStorage` ở frontend.
- Backend Express có endpoint kiểm tra sức khỏe `/health`.

## Công nghệ

- Frontend: React 19, TypeScript, Vite, Tailwind CSS v4, ESLint, Prettier.
- Backend: Node.js, Express 5, JavaScript ESM, dotenv.
- Database định hướng: MySQL, mysql2, Prisma. Backend hiện mới là scaffold tối giản.

## Cấu trúc thư mục

```text
VIP-Booking/
  backend/
    src/app.js
    package.json
  frontend/
    src/
      components/
      context/
      data/
      pages/
      routes/
      utils/
    package.json
  README.md
```

## Yêu cầu môi trường

- Node.js phiên bản mới tương thích Vite 8 và React 19.
- npm.

## Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy ở:

```text
http://localhost:5173
```

Nếu port `5173` đang bận, Vite sẽ dùng port kế tiếp.

## Cấu hình frontend

Tạo file `.env` trong thư mục `frontend` nếu cần gọi API hoặc OAuth:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_CLIENT_ID=your-apple-service-id
VITE_APPLE_REDIRECT_URI=http://localhost:5173/login
```

## Chạy backend

```bash
cd backend
npm install
npm run dev
```

Backend mặc định chạy ở:

```text
http://localhost:8080
```

Kiểm tra backend:

```bash
curl http://localhost:8080/health
```

Kết quả mong đợi:

```json
{ "status": "ok" }
```

## Scripts frontend

```bash
npm run dev      # chạy Vite dev server
npm run build    # type-check và build production
npm run lint     # kiểm tra ESLint
npm run format   # format code bằng Prettier
npm run preview  # preview build production
```

## Scripts backend

```bash
npm run dev      # chạy backend bằng nodemon
npm start        # chạy backend bằng node
```

## Tài khoản demo

```text
Admin:
email: admin@vipbooking.vn
password: vipbooking

Guest:
email: guest@vipbooking.vn
password: vipbooking
```

## Ghi chú Git

Một số thư mục backend có file `a.txt` để Git theo dõi thư mục rỗng. Git không push thư mục rỗng nếu không có file bên trong.

