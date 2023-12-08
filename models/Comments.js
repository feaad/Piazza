const mongoose = require('mongoose')

// Creating a comments schema
const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

    comments: {
        type: String,
        min: 1,
        max: 255
    },

    createdOn: {
        type: Date,
        required: true,
        default: new Date()
    }
})

module.exports = mongoose.model('comments', commentSchema)