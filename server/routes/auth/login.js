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
});

const jwt = require('jsonwebtoken');

const genToken = (user)=>{
  const token = jwt.sign({_id: user._id.toString()},"avinoamruach",{expiresIn:"5 minutes"})
  return token
}



router.post("/", async (req, res, next) => {

  const requestedUser = {
    email,
    password
  } = req.body;
  const isValidRequest = await loginSchema.validateAsync(requestedUser)
  if (!isValidRequest)return res.send("Invalid email/password")

  const user = await Users.findOne({email: requestedUser.email})
  const matchedPass = await bcrypt.compare(requestedUser.password,user.password)
  console.log(user.password, " ",requestedUser.password)
  if (!matchedPass || !user) return res.send("Wrong email/password")
  
  const token = genToken(user)
  res.send({user,token})







});




module.exports = router;