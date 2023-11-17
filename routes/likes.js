const express = require('express')
const router = express.Router()

const Likes = require('../models/Likes')
const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')
const e = require('express')

// Update likes for a post
//things to do -> author of post can not like
//sending a like when already liked deletes the like
router.post('/:post_id', verifyToken, async (req, res) => {
    try {
        const postById = await Posts.findById(req.params.post_id)
        if (!postById) {
            return res.status(400).send({message:'Can not find post'})
        }
        else {
            const currentUser = req.user;
            const postLike = await Likes.findOne({
                post_id: postById, user_id: currentUser._id
            })
            if (!postLike) {
                const newLike = new Likes({
                    post_id: postById,
                    user_id: currentUser._id
                })
                try {
                    const savedLikes = await newLike.save()
                    //Update post with the new like(adding the users id)
                    await Posts.updateOne({
                        _id: postById
                    }, {
                        $push: {
                            likes: savedLikes._id
                        }
                    })
                    return res.status(200).send({message: 'Like added'})
                }
                catch (err) {
                    res.status(400).send({message:err})
                }
            }
            //if the post has been liked already, delete the like
            else {
                await Likes.deleteOne({
                    _id: postLike._id
                })
                await Posts.updateOne({
                    _id: postLike.post_id
                }, {
                    $unset: {
                        likes: postLike._id
                    }
                })
                return res.status(200).send({message: 'Like removed'})
            }
            // return res.send(postById)
        }
        
    }
    catch (err) {
        res.send({message:'can not find post'})
    }
})



module.exports = router