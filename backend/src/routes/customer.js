const express = require('express');
const { Op } = require('sequelize');
const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/customers
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    
    if (search) {
      where = {
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { idNumber: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const customers = await Customer.findAll({
      where,
      include: [{
        model: Booking,
        as: 'bookingHistory'
      }]
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/customers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Booking,
        as: 'bookingHistory'
      }]
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/customers
router.post('/', protect, async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.update(req.body);
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;