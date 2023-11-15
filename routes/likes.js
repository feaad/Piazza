const express = require('express')
const router = express.Router()

const Likes = require('../models/Likes')
const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')
const e = require('express')


router.post('/:post_id', verifyToken, async (req, res) => {
    try {
        const postById = await Posts.findById(req.params.post_id)
        if (!postById) {
            return res.status(400).send({message:'Can not find post'})
        }
        else {
            const currentUser = req.user;
            const existingLike = await Likes.findOne({
                post_id: postById, user_id: currentUser._id
            })
            if (!existingLike) {
                const newLike = new Likes({
                    post_id: postById,
                    user_id: currentUser._id
                })
                try {
                    const savedLikes = await newLike.save()
                    // res.send(savedLikes)
                    const updatePost = await Posts.updateOne({
                        _id: postById
                    }, {
                        $set: {
                            likes: savedLikes._id
                        }
                    })
                    // res.send(updatePost)
                    return res.status(200).send({message: 'Like added'})
                }
                catch (err) {
                    res.status(400).send({message:err})
                }
            }
            // return res.send(postById)
        }
        
        
    }
    catch (err) {
        res.send({message:'can not find post'})
    }
})



module.exports = router