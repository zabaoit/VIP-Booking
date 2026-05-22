const {
  createBooking
} = require('../service/bookingService');
const addBooking = async(req,res)=>{
  try{
    const booking = await createBooking(
      req.body
    );
    res.status(201).json(booking);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
module.exports = {
  addBooking
};