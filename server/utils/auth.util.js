import Joi from 'joi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import ENV_CONFIG from '#server/configs/env.config'
import userModel from '#server/models/user.model'
import { sendMailForgotPassword } from './mail.util.js'

// schema
export const schemaSignup = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})
export const schemaSignin = Joi.object({
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
  password: Joi.string().required(),
})
export const schemaForgotPassword = Joi.object({
  email: Joi.string().pattern(new RegExp(`@gmail.com`)).email().required(),
})
export const schemaResetPassword = Joi.object({
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})
export const schemaChangePassword = Joi.object({
  password: Joi.string().required(),
  confirm_password: Joi.string().valid(Joi.ref('password')).required(),
})

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}
export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// jwt
export async function generateToken(res, { payload }) {
  // generate token
  const access_token = await jwt.sign(
    { ...payload },
    ENV_CONFIG.JWT.SECRET_KEY,
    {
      expiresIn: ENV_CONFIG.JWT.SECRET_EXPIRES,
    },
  )
  const refresh_token = await jwt.sign(
    { ...payload },
    ENV_CONFIG.JWT.REFRESH_SECRET_KEY,
    {
      expiresIn: ENV_CONFIG.JWT.REFRESH_SECRET_EXPIRES,
    },
  )

  const isProduction = ENV_CONFIG.NODE_ENV === 'production'

  // save tokens to cookie
  res.cookie(`access_token`, `Bearer ` + access_token, {
    httpOnly: isProduction,
    sameSite: 'None',
    maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
    secure: true,
  })
  res.cookie(`refresh_token`, refresh_token, {
    httpOnly: isProduction,
    sameSite: 'None',
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 day
    secure: true,
  })

  //   save refresh_token to database
  await userModel.findByIdAndUpdate(
    payload._id,
    {
      refreshToken: refresh_token,
    },
    { new: true },
  )

  // return tokens
  return { access_token, refresh_token }
}
export async function generateTokenResetPassword(email, { payload }) {
  // generate token
  const reset_password_token = await jwt.sign(
    { ...payload },
    ENV_CONFIG.JWT.SECRET_KEY,
    {
      expiresIn: ENV_CONFIG.JWT.SECRET_EXPIRES,
    },
  )

  await userModel.findOneAndUpdate(
    { email },
    {
      resetPasswordToken: reset_password_token,
    },
    { new: true },
  )

  // create link for reset password
  const link =
    ENV_CONFIG.URL_WEBSITE + `/reset-password/` + reset_password_token

  // send email with reset password link
  sendMailForgotPassword({
    to: email,
    link: link,
  })

  // return token
  return reset_password_token
}
