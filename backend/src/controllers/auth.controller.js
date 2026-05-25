import { z } from 'zod';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/auth.service.js';

const registerSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().trim().min(8, 'Số điện thoại không hợp lệ').optional(),
});

const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

const handleControllerError = (res, error) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Lỗi hệ thống',
  });
};

export const register = async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload);

    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload);

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công',
  });
};
