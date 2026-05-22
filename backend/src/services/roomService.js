const Room = require('../models/Room');

const getAllRooms = async()=>{
  return await Room.findAll();
};
const createRoom = async(data)=>{
  return await Room.create(data);
};
const updateRoom = async(id,data)=>{
  const room = await Room.findByPk(id);
  if(!room){
    throw new Error('Room not found');
  }
  await room.update(data);
  return room;
};
const deleteRoom = async(id)=>{
  const room = await Room.findByPk(id);
  if(!room){
    throw new Error('Room not found');
  }
  await room.destroy();
};
module.exports = {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom
};