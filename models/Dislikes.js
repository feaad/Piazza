const mongoose = require('mongoose')

// Creating a dislike schema
const dislikesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('dislikes', dislikesSchema)