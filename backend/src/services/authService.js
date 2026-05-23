const jwt = require('jsonwebtoken');
const User = require('../models/User');
const registerUser = async(data)=>{
  const {
    fullName,
    email,
    password,
    phoneNumber
  } = data;
  const existingUser = await User.findOne({
    where:{ email }
  });
  if(existingUser){
    throw new Error('Email already exists');
  }
  const user = await User.create({
    fullName,
    email,
    password,
    phoneNumber
  });
  return user;
};
const loginUser = async(email,password)=>{

  const user = await User.findOne({
    where:{ email }
  });
  if(!user){
    throw new Error('User not found');
  }
  const isMatch = await user.comparePassword(
    password
  );
  if(!isMatch){
    throw new Error('Invalid password');
  }
  const token = jwt.sign(
    {
      id:user.id,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:'7d'
    }
  );
  return {
    token,
    user
  };
};
module.exports = {
  registerUser,
  loginUser
};