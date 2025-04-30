import dotenv from 'dotenv'
dotenv.config()

const ENV_CONFIG = {
  // CLOUDINARY
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FOLDER_NAME: process.env.CLOUDINARY_FOLDER_NAME,
    PRESET: process.env.CLOUDINARY_PRESET,
  },

  // MONGODB
  MONGODB: {
    URI: process.env.MONGODB_URI,
    DB_NAME: process.env.MONGODB_DB_NAME,
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD,
    PORT: process.env.MONGODB_PORT,
    HOST: process.env.MONGODB_HOST,
  },

  // REDIS
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PASSWORD: process.env.REDIS_PASSWORD,
    DB: process.env.REDIS_DB,
  },

  // JWT
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET_KEY,
    SECRET_EXPIRES: process.env.JWT_SECRET_EXPIRES,
    REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    REFRESH_SECRET_EXPIRES: process.env.JWT_REFRESH_SECRET_EXPIRES,
  },

  // PASSPORT
  PASSPORT: {
    SESSION_SECRET: process.env.PASSPORT_SESSION_SECRET,
    URL_REDIRECT_SUCCESS: process.env.PASSPORT_REDIRECT_SUCCESS,
    URL_REDIRECT_FAILED: process.env.PASSPORT_REDIRECT_FAILED,
    // GOOGLE
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    // GITHUB
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  },

  // EMAIL
  EMAIL: {
    USER: process.env.EMAIL_USER,
    PASSWORD: process.env.EMAIL_PASSWORD,
  },

  // PORT
  PORT: process.env.PORT,

  // URL
  URL_WEBSITE: process.env.URL_WEBSITE,

  // NODE_ENV
  NODE_ENV: process.env.NODE_ENV,
}

export default ENV_CONFIG
