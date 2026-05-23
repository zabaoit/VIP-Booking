const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Room = sequelize.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roomNumber: {
        type: DataTypes.STRING,
        unique: true
    },
    roomName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
    type: DataTypes.ENUM(
      'single',
      'double',
      'suite',
      'vip'
    ),
    defaultValue: 'single'
    },
    floor: {
    type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
    type: DataTypes.ENUM(
      'available',
      'occupied',
      'cleaning'
    ),
    defaultValue: 'available'
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    image: {
        type: DataTypes.STRING
    },

    capacity: {
        type: DataTypes.INTEGER
    },

    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
  },{
    timestamps: true,

  tableName: 'rooms'
  }
);
module.exports = Room;