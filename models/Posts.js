const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    // user_id: {
    //     type: String,
    //     required: true
    // },

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
        type: String,
        required: true
        
    },

    expiry_date: {
        type: Date
    },

    likes: {
        type: Number
    },

    dislikes: {
        type: Number
    },

    status: {
        type: Boolean
    },

    created_on: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('posts', postSchema)