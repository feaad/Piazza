// importing libraries
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


const app = express()
app.use(bodyParser.json())


mongoose.connect(process.env.DB_CONNECTOR).then(() => {
    console.log('DB is running...')
})

app.listen(3000, () => {
    console.log('Server is running...')
})