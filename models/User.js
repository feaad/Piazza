const mongoose = require('mongoose')


// Generate a user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 5,
        max: 20
    },

    email: {
        type: String,
        require: true,
        min: 6,
        max: 256
    },

    password: {
        type: String,
        require: true,
        min: 8,
        max: 14
    },

    created_on: {
        type: Date,
        default: Date.now
    },

    updated_on: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('users', userSchema)