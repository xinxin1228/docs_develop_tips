const path = require('node:path')

require('dotenv').config({
  path: path.resolve(__dirname, `../env/.env.${process.env.NODE_ENV}`),
})

getProcessEnv('NODE_ENV')
getProcessEnv('PORT')
getProcessEnv('API_URL')

function getProcessEnv(key) {
  console.log(`process.env.${key}：`, process.env[key])
}
