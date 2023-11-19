const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    topic: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
        min: 5,
        max: 256
    },

    message: {
        type: String,
        required: true,
        min: 3,
        max: 280
    },

     author: {
        type: String
        
    },

    likes:{
        type: Number
    },

    dislikes: {
        type: Number
    },

    comments: {
        type: Number
    },

    status: {
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live'
    },


    created_on: {
        type: Date,
        required: true,
        default: new Date()
    },
    expires_on: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('posts', postSchema)