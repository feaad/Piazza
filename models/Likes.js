const mongoose = require('mongoose')

const likesSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('likes', likesSchema)