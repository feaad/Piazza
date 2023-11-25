const mongoose = require('mongoose')

// Creating a dislike schema
const dislikesSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('dislikes', dislikesSchema)