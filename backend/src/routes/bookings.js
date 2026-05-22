const express = require('express');
const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.get('/', protect, async (req, res) => {
  try {
    const { status, startDate, endDate, customerId } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (startDate && endDate) {
      where.checkIn = { [Op.gte]: new Date(startDate) };
      where.checkOut = { [Op.lte]: new Date(endDate) };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'fullName', 'email', 'phone'] },
        { model: Room, as: 'room', attributes: ['id', 'roomNumber', 'type', 'price'] }
      ]
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Room, as: 'room' }
      ]
    });
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { customerId, roomId, checkIn, checkOut, guests } = req.body;

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * parseFloat(room.price);

    const booking = await Booking.create({
      customerId,
      roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });

    room.status = 'occupied';
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (booking) {
      await booking.update(req.body);
      
      if (req.body.status === 'checked-out') {
        await Room.update({ status: 'cleaning' }, { where: { id: booking.roomId } });
      }
      
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (booking) {
      await Room.update({ status: 'available' }, { where: { id: booking.roomId } });
      await booking.destroy();
      res.json({ message: 'Booking cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/check-in', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (booking) {
      await booking.update({ status: 'checked-in' });
      await Room.update({ status: 'occupied' }, { where: { id: booking.roomId } });
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/check-out', protect, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (booking) {
      await booking.update({ 
        status: 'checked-out',
        paymentStatus: req.body.paymentStatus || 'paid'
      });
      await Room.update({ status: 'cleaning' }, { where: { id: booking.roomId } });
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
