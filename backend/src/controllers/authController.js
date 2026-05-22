const {registerUser,loginUser
} = require('../service/authService');
const register = async(req,res)=>{
  try{
    const user = await registerUser(
      req.body
    );
    res.status(201).json({
      message:'Register successful',user
    });
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
const login = async(req,res)=>{
  try{
    const { email,password
    } = req.body;
    const data = await loginUser( email,password
    );
    res.json(data);
  }catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};
module.exports = {
  register,
  login
};