const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validations/validations')

const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

//Validate registration input
router.post('/register', async (req,res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error['details'][0]['message'])
    }

    // If the user already exists
    const userExist = await User.findOne({ email: req.body.email })
    if (userExist) {
        return res.status(400).send({ message: 'User already exists' })
    }

    //Hashing password for security
    const salt = await bcrypt.genSalt(5)
    const passwordHash = await bcrypt.hash(req.body.password, salt)

    //Register and add new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: passwordHash
    })
    try {
        const newUser = await user.save()
        res.send(newUser)
    }
    catch (err) {
        res.status(400).send({message:err})
    }
})

//Validate user login
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) {
        return res.status(400).send(error['details'][0]['message'])
    }

    //Check if user exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send({ message: 'User does not exists. Register for a Piazza app' })
    }

    //Check validity of user password
    const passwordCheck = await bcrypt.compare(req.body.password, user.password)
    if (!passwordCheck) {
        return res.status(400).send({message: 'Password is invalid'})
    }

    //Authentication Token
    const token = jsonwebtoken.sign({ _id: user.id }, process.env.TOKEN)
    res.header('auth-token', token).send({'auth-token': token})
})

module.exports = router