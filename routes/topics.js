const express = require('express')
const router = express.Router()

const Topic = require('../models/Topics')
const verifyToken = require('../VerifyToken')

//Adding topics to the database
// router.post('/', async (req, res) => {
//     const topic = new Topic({
//         topic_name: req.body.topic_name
//     })
//     try {
//         const newTopic = await topic.save()
//         res.send(newTopic)
//     }
//     catch (err) {
//         res.status(400).send({message:err})
//     }
// })

//Get all topics in database
// router.get('/', verifyToken, async (req, res) => {
//     try {
//         const topics = await Topic.find({}, {
//             topic_name: 1,
//             _id:0
//         })
//         res.send(topics)
//     }
//     catch(err) {
//         res.send({message:err})
//     }
// })


router.get('/', verifyToken, async (req, res) => {
    try {
        const topics = await Topic.find()
        res.send(topics)
    }
    catch(err) {
        res.send({message:err})
    }
})

//Search by topics
// router.get()


module.exports = router