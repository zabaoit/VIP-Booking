import { z } from 'zod';
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../services/auth.service.js';
import { handleControllerError, sendSuccess } from '../utils/response.js';

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

export const register = async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload);

    return sendSuccess(res, {
      statusCode: 201,
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

    return sendSuccess(res, {
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

    return sendSuccess(res, {
      data: { user },
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, {
    message: 'Đăng xuất thành công',
  });
};
