const Booking = require('../models/Booking');
const Room = require('../models/Room');
const calculateDays = (checkIn,checkOut)=>{
  return Math.ceil(
    (
      new Date(checkOut) - new Date(checkIn)
    )
    /
    (1000*60*60*24)
  );
};
const createBooking = async(data)=>{
  const {
    customerId,
    roomId,
    checkIn,
    checkOut,
    guests
  } = data;
  // FIND ROOM
  const room = await Room.findByPk(roomId);
  if(!room){
    throw new Error('Room not found');
  }
  if(room.status !== 'available'){
    throw new Error('Room not available');
  }
  const days = calculateDays(
    checkIn,
    checkOut
  );
  const totalPrice = days * room.price;
  const booking = await Booking.create({
    customerId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalPrice
  });
  room.status = 'occupied';
  await room.save();
  return booking;
};
module.exports = {
  createBooking
};