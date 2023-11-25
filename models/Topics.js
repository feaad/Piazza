const mongoose = require('mongoose')

// Creating a comments schema
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