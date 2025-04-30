import mongoose from 'mongoose'
import ENV_CONFIG from './env.config.js'

export async function connectMongoDB() {
  mongoose
    .connect(ENV_CONFIG.MONGODB.URI, {
      dbName: ENV_CONFIG.MONGODB.DB_NAME,
    })
    .then(function (value) {
      console.log('Connected to MongoDB:: ' + value.connections[0].name)
    })
    .catch(function (err) {
      console.error('Failed to connect to MongoDB:: ' + err?.message)
      process.exit(1)
    })
}
