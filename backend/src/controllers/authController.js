import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({
            message: "Please provide both email and password!"
        });

    try {

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password!"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch)
            return res.status(400).json({
                message: "Incorrect email or password!"
            });
        
        const userRole = await prisma.role.findUnique({
            where: { id: user.role_id } // user.role_id kiểu BigInt truyền vào đây Prisma vẫn hiểu
        });
        
        // Trích xuất chuỗi text nguyên thủy ("admin", "user"), không cầm theo Object chứa BigInt
        const roleName = userRole ? userRole.role_name : "user";

        // 4. Ký mã hóa Token JWT an toàn với các kiểu dữ liệu String
        const token = jwt.sign(
            {
                id: user.id.toString(),
                email: user.email,
                role: roleName // Chuỗi text sạch
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 5. Trả về kết quả hoàn chỉnh
        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user.id.toString(), // Đã ép kiểu String an toàn
                email: user.email,
                full_name: user.full_name,
                phone: user.phone,
                role: roleName
            }
        });
    } catch (error) {
        console.error("Lỗi AuthController thực tế:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
}




// Đảm bảo đầu file của bạn đã import đầy đủ prisma và bcrypt rồi nhé

export const register = async (req, res) => {
    const { email, password, full_name, phone } = req.body;

    // 1. Kiểm tra các trường dữ liệu bắt buộc đầu vào
    if (!email || !password || !full_name) {
        return res.status(400).json({
            message: "Please fill in all required fields: Email, Password, and Full Name!"
        });
    }

    try {
        // 2. Kiểm tra xem email này đã tồn tại trong hệ thống chưa
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "This email is already registered by another account!"
            });
        }

        // 3. Tiến hành mã hóa mật khẩu của User mới bằng bcryptjs
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Lưu User mới vào Database
        // 🎯 MẶC ĐỊNH: Đăng ký qua form công khai luôn là Khách (role_id = 2)
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password_hash: hashedPassword,
                full_name: full_name,
                phone: phone || null, // Trường số điện thoại không bắt buộc, nếu không có thì để null
                role_id: 2 // Khóa ngoại liên kết sang bảng role (2 = user khách)
            }
        });

        // 5. Trả về thông báo thành công (Ẩn password_hash đi cho bảo mật)
        return res.status(201).json({
            message: "Account registered successfully!",
            user: {
                id: newUser.id.toString(), // Ép kiểu BigInt về String để không lỗi JSON
                email: newUser.email,
                full_name: newUser.full_name,
                phone: newUser.phone,
                role_id: newUser.role_id.toString()
            }
        });

    } catch (error) {
        console.error("Lỗi chức năng Đăng ký:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};