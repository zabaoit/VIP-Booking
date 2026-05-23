import jwt from 'jsonwebtoken';

// Hàm authorize nhận vào một mảng các quyền được phép truy cập (Ví dụ: ['admin', 'staff'])
export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        // 1. Lấy token từ thuộc tính Authorization trong Header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Tách bỏ chữ "Bearer " để lấy chuỗi token

        if (!token) {
            return res.status(401).json({
                message: "Truy cập bị từ chối! Bạn chưa đăng nhập hoặc thiếu Token."
            });
        }

        try {
            // 2. Kiểm tra tính hợp lệ của Token bằng JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Lưu thông tin user đã giải mã vào đối tượng req để các controller phía sau sử dụng nếu cần
            req.user = decoded; 

            // 3. KIỂM TRA PHÂN QUYỀN (Core Logic)
            // Nếu có cấu hình giới hạn quyền VÀ quyền của user không nằm trong danh sách cho phép
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({
                    message: `Lỗi phân quyền: Tài khoản quyền '${decoded.role}' không thể truy cập chức năng này!`
                });
            }

            // Nếu hợp lệ, cho phép đi tiếp vào Controller
            next();

        } catch (error) {
            return res.status(403).json({
                message: "Mã Token không hợp lệ hoặc đã hết hạn!",
                error: error.message
            });
        }
    };
};