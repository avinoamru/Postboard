// Imports
const router = require('express').Router();
require('dotenv').config();
const monk = require('monk').default(process.env.MONGO_URI);

const Users = monk.get("users");



router.get("/",(req,res,next)=>{
  try{
    Users.find().then(users=>res.send(users)).catch(err=>res.send({error:err}))

  }catch(err){
    return res.status(400).send(err)
  }
})


module.exports = router;