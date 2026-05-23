const {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
} = require('../service/roomService');
const getRooms = async(req,res)=>{
  try{
    const rooms = await getAllRooms();
    res.json(rooms);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
const addRoom = async(req,res)=>{
  try{
    const room = await createRoom(
      req.body
    );
    res.status(201).json(room);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
const editRoom = async(req,res)=>{
  try{
    const room = await updateRoom(
      req.params.id,
      req.body
    );
    res.json(room);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};

const removeRoom = async(req,res)=>{
  try{
    await deleteRoom(req.params.id);
    res.json({
      message:'Room deleted'
    });
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
module.exports = {getRooms,addRoom,editRoom, removeRoom
};