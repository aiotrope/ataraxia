const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 3000
const mongo_url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/testdb'

const config = {
  port,
  mongo_url,
}

module.exports = config
