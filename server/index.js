// Imports
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const volleyball = require('volleyball');
const app = express();

// Routes
const postsRoute = require('./routes/posts');
const loginRoute = require('./routes/auth/login');
const signupRoute = require('./routes/auth/signup');

// Global middlewares
app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(volleyball)

// Route middlewares
app.use("/posts",postsRoute)
app.use("/signup",signupRoute)
app.use("/login",loginRoute)




const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`)
})