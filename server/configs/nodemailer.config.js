import nodemailer from 'nodemailer'
import ENV_CONFIG from './env.config.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV_CONFIG.EMAIL.USER,
    pass: ENV_CONFIG.EMAIL.PASSWORD,
  },
})

export default transporter
