import express from 'express'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import ENV_CONFIG from '#server/configs/env.config'
import userModel from '#server/models/user.model'
import { handleResponse } from '#server/helpers/responses.helper'
import { generateToken } from '#server/utils/auth.util'

const passportRouter = express.Router()

passportRouter.get('/signin-passport/success', async (req, res, next) => {
  try {
    const user = req.user

    // check if user
    if (!user) {
      throw createHttpError.Unauthorized(`Authentication failed`)
    }
    const userExists = await userModel.findOne({
      email: user.email,
    })
    if (!userExists) {
      throw createHttpError.NotFound('User not found')
    }

    // create and save tokens
    const token = await generateToken(res, {
      payload: {
        _id: userExists._id,
        role: userExists.role,
      },
    })

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User signed in successfully',
      data: {
        user: userExists,
        access_token: token.access_token,
      },
    })
  } catch (error) {
    next(error)
  }
})
passportRouter.get('/signin-passport/failed', async (req, res, next) => {
  try {
    return handleResponse(res, {
      status: StatusCodes.UNAUTHORIZED,
      message: 'Authentication failed',
    })
  } catch (error) {
    next(error)
  }
})

// google
passportRouter.get(`/google`, passport.authenticate('google'))
passportRouter.get(
  `/google/callback`,
  passport.authenticate('google', {
    successRedirect: ENV_CONFIG.PASSPORT.URL_REDIRECT_SUCCESS,
    failureRedirect: ENV_CONFIG.PASSPORT.URL_REDIRECT_FAILED,
  }),
)

// github
passportRouter.get(`/github`, passport.authenticate('github'))
passportRouter.get(
  `/github/callback`,
  passport.authenticate('github', {
    successRedirect: ENV_CONFIG.PASSPORT.URL_REDIRECT_SUCCESS,
    failureRedirect: ENV_CONFIG.PASSPORT.URL_REDIRECT_FAILED,
  }),
)

export default passportRouter
