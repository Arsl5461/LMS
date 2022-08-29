const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const User=require("../model/userModel")
const dotenv=require("dotenv").config()


//@desc Register Users
//@route POST/api/users
//@access PUBLIC

const registerUser=asyncHandler(async(req,res)=>{
  const {name,email,password}=req.body
  
  if(!name || !email || !password){
    res.status(400)
    throw new Error("Please add all fields")
  }
  // Check if user Exist 
const userExists=await User.findOne({email})
if(userExists){
    res.status(400)
    throw new Error('User Already Registered')
}
//Hash password
const salt=await bcrypt.genSalt(10)
const hashedPassword= await bcrypt.hash(password,salt)

//Create User
const user=await User.create({
  name,
  email,
  password:hashedPassword
})

if(user){
  res.status(201).json({
    _id:user.id,
    name:user.name,
    email:user.email,
    token:generateToken(user._id)
  })
}
else{
  res.status(400)
  throw new Error("Invalid User data")
}
})
//@desc Login Users
//@route POST/api/users
//@access PUBLIC


const loginUser=asyncHandler(async(req,res)=>{
  const {email,password} = req.body


  const user = await User.findOne({email})

  if(user && (await bcrypt.compare(password, user.password))){
    res.json({
      _id:user.id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id),
    })
  }
  else{
      res.status(400)
      throw new Error("Invalid Credentials")
    }   
})
//@desc Me Users
//@route POST/api/users
//@access PUBLIC

const getMe=asyncHandler(async(req,res)=>{
    const {_id,name,email}=await User.findById(req.user.id)
    res.status(200).json({
      id:_id,
      name,
      email
    })
})


//Generate Token
const generateToken = (id) => {
  return jwt.sign({id},process.env.JWT_SCRT,{
    expiresIn:'30d',
  })
}

module.exports={
    registerUser,
    loginUser,
    getMe
} 

