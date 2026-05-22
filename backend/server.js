const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/bookings');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to database:', error);
  }
};

const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
