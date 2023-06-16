const morgan = require('morgan')
const createError = require('http-errors')
const logger = require('./logger')

const stream = {
  write: (message) => logger.http(message),
}

const skip = () => {
  /* eslint-disable-next-line no-undef */
  const env = process.env.NODE_ENV || 'development'
  /* eslint-enable-next-line no-undef */

  return env !== 'development'
}

const loggingMiddleware = (req, res, next) => {
  morgan(
    ':remote-addr :method :url :status :res[content-length] - :response-time ms',

    { stream, skip }
  )
  next()
}

const endPoint404 = (req, res, next) => {
  next(createError(404))
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({
      error: `${error.name}: invalid ${error.path} using ${error.value}`,
    })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message })
  } else if (error.name === 'MongoServerError') {
    return res.status(400).json({
      error: `duplicate username ${req.body.username} cannot be registered!`,
    })
  } else if (error.name === 'TypeError') {
    return res.status(400).json({ error: error.message })
  }
  next()
}

module.exports = {
  loggingMiddleware,
  endPoint404,
  errorHandler
}