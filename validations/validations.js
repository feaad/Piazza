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

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256),
        password: joi.string().required().min(8).max(14)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation