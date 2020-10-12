// Imports
const router = require('express').Router();
require('dotenv').config();
const monk = require('monk').default(process.env.MONGO_URI);
const joi = require('joi');
const bcrypt = require('bcrypt');
const Users = monk.get("users");

const signupSchema = joi.object({
  email: joi.string().max(255).email({ allowUnicode: false }).required(),
  name: joi.string().min(3).max(50).trim().required(),
  password: joi.string().min(8).max(18).required()
});

router.post("/", async (req, res, next) => {
  const user = { email, name, password } = req.body;

  try {

    const validatedUserinfo = await signupSchema.validateAsync(user);
    const userAlreadyExists = await Users.findOne({ email: validatedUserinfo.email });

    if (!userAlreadyExists) {

      const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
      const hashedPassword = await bcrypt.hash(validatedUserinfo.password, salt);
      validatedUserinfo.password = hashedPassword;
      const newUser = await Users.insert(validatedUserinfo);
      return res.status(200).send(newUser);

    } else res.status(400).send("Email already exists.").end();

  } catch (err) {
    next(err);
  }


});




module.exports = router;