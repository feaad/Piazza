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

    likes: [{
        // type: Number
        type: mongoose.Schema.Types.ObjectId
        
    }],

    dislikes: {
        type: Number
    },

    status: {
        type: String
    },

    created_on: {
        type: Date,
        required: true,
        default: new Date()
    },
    expires_in: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('posts', postSchema)