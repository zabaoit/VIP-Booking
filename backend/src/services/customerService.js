const Customer = require('../models/Customer');
const getCustomers = async()=>{
  return await Customer.findAll();
};
const createCustomer = async(data)=>{
  return await Customer.create(data);
};
module.exports = {
  getCustomers,
  createCustomer
};