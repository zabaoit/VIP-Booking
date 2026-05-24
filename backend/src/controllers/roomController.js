export const createRoom = (req, res) => {
    res.json({ message: 'Room created successfully!' });
};

export const getAllRooms = (req, res) => {
    res.json({ message: 'Get room list successfully!' });
};

export const deleteRoom = (req, res) => {
    res.json({ message: 'Room deleted successfully!' });
};