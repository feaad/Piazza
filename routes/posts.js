const express = require('express')
const router = express.Router()

const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')
const User = require('../models/User')

const { postValidation } = require('../validations/validations')


router.post('/', verifyToken, async (req, res) => {
    //Get the user id to retrieve username

    const { error } = postValidation(req.body)
    if (error) {
        return res.status(400).send(error['details'][0]['message'])
    }


    const getUserById = await User.findById(req.user._id)
    const username = getUserById.username
    
    const post = new Posts({
            topic: req.body.topic,
            title: req.body.title,
            message: req.body.message,
            author: username    
        })
    try {
        const savePost = await post.save()
        res.send(savePost)
    }
    catch (err) {
        res.send({message:err})
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Posts.find()
        res.send(posts)
    }
    catch (err) {
        res.send({message:err})
    }
})

module.exports = router