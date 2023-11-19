const express = require('express')
const router = express.Router()

const Comments = require('../models/Comments')
const Posts = require('../models/Posts')
const verifyToken = require('../VerifyToken')

const { commentValidation } = require('../validations/validations')

router.post('/:post_id', verifyToken, async (req, res) => {
    try {
        const postById = await Posts.findById(req.params.post_id)

        //check if post exists
        if (!postById) {
            res.status(400).send({message:'Can not find post'})
        }

        //check if post is Live
        else if (postById.status === 'Expired') {
            return res.status(405).send({message: 'Post has expired'})
        }

        else {
            const currentUser = req.user
            const commentCount = await Comments.countDocuments({post_id: postById})
            const comment = new Comments({
                post_id: postById,
                user_id: currentUser._id,
                comments: req.body.comments
            })
            try {
                const saveComment = await comment.save()
                res.send(saveComment)

                await Posts.updateOne({
                    _id:postById
                }, {
                    $set: {
                        comments: commentCount + 1
                    }
                })
            }
            catch (err) {
                res.send({message: err})
            }
        }

        res.send(postById)
    }
    catch (err) {
        res.send({message:err})
    }
})
module.exports = router
