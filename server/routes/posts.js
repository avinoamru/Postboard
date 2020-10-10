// Imports
const router = require('express').Router();
require('dotenv').config();
const monk = require('monk').default(process.env.MONGO_URI);
const joi = require('joi');
const Posts = monk.get("posts")

const postSchema = joi.object({
  name: joi.string().min(3).max(60).trim().required(),
  postContent: joi.string().max(256).required()
})

monk.then(() => {
  console.log("Connected to MongoDB ")
})



router.get("/", async (req, res, next) => {
  const posts = await Posts.find()
  res.status(200).type("json").send(posts)

})

router.post("/post", (req, res, next) => {
  const newPost = {
    name,
    postContent
  } = req.body;

  try {

    postSchema.validateAsync(newPost).then((validPost) => {
      Posts.findOne(validPost).then(foundPost => {
          if (foundPost) res.status(400).send({
            error: "Post already exist."
          })
          else Posts.insert(validPost).then(() => res.status(200).send(validPost)).catch(err=>res.status(400).send({
            error:err
          }))
        }).catch(err => res.status(400).send({
          error: err
        }))
    }).catch(err=>res.status(400).send({
      error:err
    }))

  } catch (error) {}

})

router.delete("/post/:id",(req,res,next)=>{
  const {id} = req.params
  Posts.findOne({_id: id }).then(foundPost=>{
    if(foundPost) Posts.remove({_id:id}).then(()=>res.send({
      deleted: foundPost
    })).catch(err=>res.status(400).send(err))
    else res.send({
      message: "Post not found."
    })
  })
  
})


module.exports = router;