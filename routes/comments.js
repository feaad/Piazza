const express = require('express')
const router = express.Router()

const Comments = require('../models/Comments')
const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')

router.post(':/post_id', verifyToken, async (req, res) => {
    try {
        const postById = await Posts.findById(req.params.post_id)
        if (!postById) {
            res.status(400).send({message:'Post does not exist'})
        }
        else if (postById.status === 'Expired') {
            res.status(400).send({ message: 'Post has expired'})
        }
        else {
            const currentUser = req.user
            const commentCount = await Comments.countDocument({post_id:postById})
            const newComment = new Comments({
                post_id: postById,
                user_id: currentUser._id,
                comments: req.body.comments
            })
            await newComment.save()

            //Update Post collection to show number of comments for a post
            await Posts.updateOne({
                _id: postById
            }, {
                $set: {
                    comments: commentCount + 1
                }
            })
            res.status(200).send({message:'Message added'})
        }
    }
    catch (err) {
        res.send({message:err})
    }
})


module.exports = router
