// Imports
const router = require('express').Router();
require('dotenv').config();
const monk = require('monk').default(process.env.MONGO_URI);
const joi = require('joi');
const bcrypt = require('bcrypt');
const Users = monk.get("users");


const loginSchema = joi.object({
  email: joi.string().email({
    allowUnicode: false
  }).required(),
  password: joi.string().min(8).required()
})




router.post("/", (req, res, next) => {

  const user = {
    email,
    password
  } = req.body;
console.log(user.email)

  loginSchema.validateAsync(user).then(()=>{
    Users.findOne(user.email).then(userFound=>{
      if(!userFound)return res.status(300).send("Invalid email/password")
      Users.findOneAndUpdate(user,{...user,token:Math.round.toString()})
      
    })
  }).catch(err=>res.send({
    error: err
  }))

 


})




module.exports = router;