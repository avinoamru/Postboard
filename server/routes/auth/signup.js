// Imports
const router = require('express').Router();
require('dotenv').config();
const monk = require('monk').default(process.env.MONGO_URI);
const joi = require('joi');
const bcrypt = require('bcrypt');
const Users = monk.get("users");

const signupSchema = joi.object({
  email: joi.string().max(255).email({allowUnicode:false}).required(),
  name: joi.string().min(3).max(50).trim().required(),
  password: joi.string().min(8).max(18).required()
})

router.post("/", async (req, res, next) => {
  const user = {email,name,password} = req.body

  try{
    const validatedUserinfo = await signupSchema.validateAsync(user)
    
    const isUserAlreadyExists = await Users.findOne({email:validatedUserinfo.email})
    if(!isUserAlreadyExists){
      const newUser = await Users.insert(validatedUserinfo)
      const salt = await bcrypt.genSalt(process.env.SALT)
      const hashedPassword = await bcrypt.hash(newUser.password,salt)
      return res.status(200).send({...newUser, password : hashedPassword})

    }

    res.status(400).send("Email already exists.")

  }catch(err){
      res.status(400).send({error:err})
  }


});

router.get("/users",(req,res,next)=>{
  try{
    Users.find().then(users=>res.send(users)).catch(err=>res.send({error:err}))

  }catch(err){
    return res.status(400).send(err)
  }
})


module.exports = router;