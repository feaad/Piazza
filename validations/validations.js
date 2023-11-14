//Libraries
const joi = require('joi')

//Validating registration details
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username: joi.string().required().min(5).max(20),
        email: joi.string().required().min(6).max(256),
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
        topic: joi.string().required(),
        title: joi.string().min(5).max(256).required(),
        message: joi.string().min(3).max(280).required()
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation