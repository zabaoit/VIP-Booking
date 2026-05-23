export const createRoom = (req, res) => {
    res.json({ message: 'Tạo phòng thành công' });
};

export const getAllRooms = (req, res) => {
    res.json({ message: 'Danh sách phòng' });
};

export const deleteRoom = (req, res) => {
    res.json({ message: 'Xóa phòng thành công' });
};