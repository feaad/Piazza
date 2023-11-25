const mongoose = require('mongoose')

// Creating a likes schema
const likesSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('likes', likesSchema)