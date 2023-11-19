const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    comments: {
        type: String,
        min: 1,
        max: 255
    },

    created_on: {
        type: Date,
        required: true,
        default: new Date()
    }
})

module.exports = mongoose.model('comments', commentSchema)