const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/index')
const messagesRouter = require('./routes/sentMessagesRoutes')
const statsMessagesRouter = require('./routes/statsMessagesRoutes')

const app = express()

/**
 * Settings
 */

app.use(cors())
app.use(express.json())
app.set('json spaces', 2)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

/**
 * CORS
 */

// const whiteList = ['http://localhost:8080']

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.indexOf(origin) !== 1) {
//       return callback(null, true)
//     }

//     callback(new Error('Not allowed by CORS'))
//   }
// }

/**
 * Middlewares
 */

app.use(cookieParser())
app.use(logger('dev'))

/**
 * Routes
 */

app.use('/', indexRouter)
app.use('/api/v1/messages', messagesRouter)
app.use('/api/v1/stats/messages', statsMessagesRouter)

module.exports = app
