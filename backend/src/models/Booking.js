const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const Room = require('./Room');
const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  guests: {
    type: DataTypes.JSON,
    defaultValue: {
      adults: 1,
      children: 0
    }
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'checked-in',
      'checked-out',
      'cancelled'
    ),
    defaultValue: 'pending'
  },

  paymentStatus: {
    type: DataTypes.ENUM(
      'unpaid',
      'partial',
      'paid'
    ),
    defaultValue: 'unpaid'
  },

  paymentMethod: {
    type: DataTypes.ENUM(
      'cash',
      'credit_card',
      'bank_transfer',
      'other'
    )
  },

  specialRequests: {
    type: DataTypes.TEXT
  },

  bookingSource: {
    type: DataTypes.ENUM(
      'direct',
      'booking.com',
      'agoda',
      'traveloka',
      'other'
    ),
    defaultValue: 'direct'
  }
}, {
  timestamps: true,
  tableName: 'bookings'
});
Booking.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer'
});

Booking.belongsTo(Room, {
  foreignKey: 'roomId',
  as: 'room'
});

Customer.hasMany(Booking, {
  foreignKey: 'customerId',
  as: 'bookingHistory'
});

Room.hasMany(Booking, {
  foreignKey: 'roomId',
  as: 'bookings'
});
module.exports = Booking;