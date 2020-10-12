const jwt = require('jsonwebtoken');


const genToken = () =>{
const token = jwt.sign({_id: "Avinoam Ruach"},"HelloWorld",{expiresIn:"3 seconds"});
console.log(token)

const data = jwt.verify(token,"HelloWorld")
console.log(data)
}

genToken()