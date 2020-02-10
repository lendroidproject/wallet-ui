require('dotenv').config()
const withImages = require('next-images')

module.exports = withImages({
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    FORTMATIC_API_KEY: process.env.FORTMATIC_API_KEY,
  },
})
