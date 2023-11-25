const express = require('express')
const router = express.Router()

const Topic = require('../models/Topics')
const verifyToken = require('../VerifyToken')

//Get all topics 
router.get('/', verifyToken, async (req, res) => {
    try {
        const topics = await Topic.find()
        res.send(topics)
    }
    catch(err) {
        res.send({message:err})
    }
})

module.exports = router