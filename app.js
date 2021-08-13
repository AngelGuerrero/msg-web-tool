const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')

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
app.use(bodyParser.urlencoded({ extended: true }))

/**
 * Routes
 */

const routes = require('./routes/routes.json')
routes.forEach(({ route, path }) => app.use('/' + route, require(path)))

// console.log(JSON.stringify(routes, null, 4))

module.exports = app
