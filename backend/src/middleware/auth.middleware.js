import { verifyAuthToken } from '../services/auth.service.js';

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth = (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Thiếu token đăng nhập',
    });
  }

  try {
    const decoded = verifyAuthToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
    });
  }
};
