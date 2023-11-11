const mongoose = require('mongoose')

const topicSchema = mongoose.Schema({
    topic_name: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },

    created_on: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('topics', topicSchema)