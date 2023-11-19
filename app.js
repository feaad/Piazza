// importing libraries
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')


const app = express()
app.use(bodyParser.json())

//Route to authentication
const authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

//Route to topic
const topicRoute = require('./routes/topics')
app.use('/api/topic', topicRoute)

//Route to posts
const postRoute = require('./routes/posts')
app.use('/api/post', postRoute)

//Route to likes
const likesRoute = require('./routes/likes')
app.use('/api/likes', likesRoute)

//Route to dislikes
const dislikesRoute = require('./routes/dislikes')
app.use('/api/dislikes', dislikesRoute)

//Route to comments
const commentsRoute = require('./routes/comments')
app.use('/api/comments', commentsRoute)

//Database connection
mongoose.connect(process.env.DB_CONNECTOR).then(() => {
    console.log('DB is running...')
})


app.listen(3000, () => {
    console.log('Server is running...')
})