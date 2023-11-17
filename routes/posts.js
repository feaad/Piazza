const express = require('express')
const router = express.Router()

const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')
const User = require('../models/User')

const { postValidation } = require('../validations/validations')


router.post('/', verifyToken, async (req, res) => {
    const { error } = postValidation(req.body)
    if (error) {
        return res.status(400).send(error['details'][0]['message'])
    }

    //Retrieve user id and username
    const getUserById = await User.findById(req.user._id)
    const username = getUserById.username

    //Set the expiry date
    //set the expiry to the new date

    // const currentDate = new Date();
    // const expiryDate = new Date(currentDate.getDate() + 3)

    const currentDate = new Date();
    const expiryDate = currentDate.setDate(currentDate.getDate() + req.body.expires_on)

    // const likeNumber = 0;

    const post = new Posts({
        user_id: req.user._id,
        author: username,
        topic: req.body.topic,
        title: req.body.title,
        message: req.body.message,
        status: 'Live',
        expires_on: expiryDate
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

//Like and Dislike method
//Author of post can not like or dislike their post

// router.patch('/', verifyToken, async (req, res) => {

    
// })


module.exports = router