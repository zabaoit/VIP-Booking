import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password)
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ email và mật khẩu!"
        });

    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "Email hoặc mật khẩu không chính xác!"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({
                message: "Email hoặc mật khẩu không chính xác!"
            });

        const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: '1d'
            }
        );

        return res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Lỗi AuthController:", error);
        return res.status(500).json({
            message: "Lỗi máy chủ"
        });
    }

}