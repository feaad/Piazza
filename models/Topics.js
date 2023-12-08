const mongoose = require('mongoose')

// Creating a comments schema
const topicSchema = mongoose.Schema({
    topicName: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },

    createdOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('topics', topicSchema)