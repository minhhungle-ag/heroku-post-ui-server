const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotEnv = require('dotenv')

const postRouters = require('./api/routes/post')
const uploadRouters = require('./api/routes/upload')
const userRouter = require('./api/routes/user')
const commentRouters = require('./api/routes/comments')
const pendingRouters = require('./api/routes/spendingPost')
const searchRouters = require('./api/routes/searchPost')
const contactRouters = require('./api/routes/contact')

const app = express()
dotEnv.config()

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATH, DELETE')
        return res.status(200).json({})
    }

    next()
})

app.use('/api/posts', postRouters)
app.use('/api/user', userRouter)
app.use('/api/upload', uploadRouters)
app.use('/api/comments', commentRouters)
app.use('/api/spending', pendingRouters)
app.use('/api/search', searchRouters)
app.use('/api/contacts', contactRouters)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
        },
    })
})

module.exports = app
