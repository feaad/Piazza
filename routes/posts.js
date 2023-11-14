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
    //get Date.now and add 3 days to obtain the expiry date
    //set the expiry to the new date

    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(currentDate.getDate() + 1);

    //Set status of the post
    //status is initially set to Live, when the date changes to the
    //expiry date, status should now be set to expired

    //Like and Dislike method

    
    const post = new Posts({
        user_id: req.user._id,
        author: username,
        topic: req.body.topic,
        title: req.body.title,
        message: req.body.message,
        expiry_date: expiryDate
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