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
        //check if status is live
        if(!postById){
            return res.status(400).send({message:'Can not find post'})
        } else if (postById.status === 'Expired') { 
            return res.status(405).send({message:'Post has expired'})
        }
        else{
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
                        $set: {
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
        }
    }
    catch (err) {
        res.send({message:err})
    }
})



module.exports = router