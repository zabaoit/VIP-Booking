const {
  getCustomers,
  createCustomer
} = require('../service/customerService');
const getAllCustomers = async(req,res)=>{
  try{
    const customers = await getCustomers();
    res.json(customers);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
const addCustomer = async(req,res)=>{
  try{
    const customer = await createCustomer(
      req.body
    );
    res.status(201).json(customer);
  }catch(error){
  res.status(500).json({
      message:error.message
    });
  }
};
module.exports = {
  getAllCustomers,
  addCustomer
};