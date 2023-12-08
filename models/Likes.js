const mongoose = require('mongoose')

// Creating a likes schema
const likesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('likes', likesSchema)