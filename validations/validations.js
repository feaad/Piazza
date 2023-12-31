//Libraries
const joi = require('joi')

//Validating registration details
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username: joi.string().required().min(4).max(20),
        email: joi.string().email().required().min(6).max(256),
        password: joi.string().required().min(8).max(14)
    })
    return schemaValidation.validate(data)
}

//Validating login details
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256),
        password: joi.string().required().min(8).max(14)
    })
    return schemaValidation.validate(data)
}

//Validating posts
const postValidation = (data) => {
    const schemaValidation = joi.object({
        topicId: joi.string().required().max(24).min(24),
        title: joi.string().min(5).max(256).required(),
        message: joi.string().min(3).max(280).required(),
        expiresOn: joi.number().required()
    })
    return schemaValidation.validate(data)
}

//Validating comments
const commentValidation = (data) => {
    const schemaValidation = joi.object({
        comments: joi.string().min(1).max(255).required()
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.commentValidation = commentValidation