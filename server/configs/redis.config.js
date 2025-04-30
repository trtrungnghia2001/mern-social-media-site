import redis from 'redis'
import ENV_CONFIG from './env.config.js'

const redisClient = redis.createClient({
  password: ENV_CONFIG.REDIS.PASSWORD,
  socket: {
    host: ENV_CONFIG.REDIS.HOST,
    port: ENV_CONFIG.REDIS.PORT,
  },
})

export async function connectRedis() {
  redisClient.connect()
  redisClient.on('connect', function () {
    console.log('Connected to Redis')
  })

  redisClient.on('error', function (err) {
    console.error(`Error connecting to Redis: ${err}`)
  })
}

export default redisClient
