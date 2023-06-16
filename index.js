const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const fileupload = require('express-fileupload')

const dbConnection = require('./utils/db')
const middlewares = require('./utils/middlewares')
const logger = require('./utils/logger')

const indexRouter = require('./controllers/index')
const port = config.port

const app = express()

/* eslint-disable-next-line no-undef */
app.set('views', path.join(__dirname, 'views'))
/* eslint-enable-next-line no-undef */

app.set('view engine', 'ejs')

dbConnection()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(cors())

app.use(cookieParser())

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')))

/* eslint-disable-next-line no-undef */
app.use(express.static(path.join(__dirname, 'uploads')))
/* eslint-enable-next-line no-undef */

app.use(fileupload())

app.use(mongoSanitize())

app.use(require('sanitize').middleware)

app.use(middlewares.loggingMiddleware)

app.use('/', indexRouter)

app.use(middlewares.endPoint404)

app.use(middlewares.errorHandler)

module.exports = app

app.listen(port, () => {
  logger.http(`Server is running on port ${port}`)
})
