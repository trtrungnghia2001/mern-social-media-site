import express from 'express'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import { handleResponse } from '#server/helpers/responses.helper'
import userModel from '#server/models/user.model'
import {
  comparePassword,
  generateToken,
  generateTokenResetPassword,
  hashPassword,
  schemaChangePassword,
  schemaForgotPassword,
  schemaResetPassword,
  schemaSignin,
  schemaSignup,
} from '#server/utils/auth.util'
import { authProtectedRouter } from '#server/middlewares/auth.middleware'
import upload from '#server/configs/multer.config'
import {
  deleteImageToCloudinary,
  uploadImageToCloudinary,
} from '#server/utils/storage.util'
import ENV_CONFIG from '#server/configs/env.config'

const authRouter = express.Router()

authRouter.post('/signup', async (req, res, next) => {
  try {
    const body = req.body
    // validate
    const validate = schemaSignup.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // check exists user
    const userExists = await userModel.findOne({
      email: body.email,
    })
    if (userExists) {
      throw createHttpError.Conflict('User already exists')
    }

    // hash password
    const hashedPassword = await hashPassword(body.password)

    // create a new user
    await userModel.create({
      ...body,
      password: hashedPassword,
    })

    // return
    return handleResponse(res, {
      status: StatusCodes.CREATED,
      message: 'User created successfully',
    })
  } catch (error) {
    next(error)
  }
})
authRouter.post('/signin', async (req, res, next) => {
  try {
    const body = req.body
    // validate
    const validate = schemaSignin.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // check exists user
    const userExists = await userModel.findOne({
      email: body.email,
    })
    if (!userExists) {
      throw createHttpError.NotFound('Invalid email or password')
    }
    // compare password
    const isMatchPassword = await comparePassword(
      body.password,
      userExists.password,
    )
    if (!isMatchPassword) {
      throw createHttpError.NotFound('Invalid email or password')
    }

    // create and save tokens
    const token = await generateToken(res, {
      payload: { _id: userExists._id, role: userExists.role },
    })

    // return
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
authRouter.delete('/signout', async (req, res, next) => {
  try {
    const getRefreshTokenFormCookie = req.cookies.refresh_token

    // clear token from cookie
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.clearCookie('connect.sid')

    // remove token from database
    await userModel.findOneAndUpdate(
      {
        refreshToken: getRefreshTokenFormCookie,
      },
      {
        refreshToken: '',
      },
      {
        new: true,
      },
    )

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User logged out successfully',
      data: null,
    })
  } catch (error) {
    next(error)
  }
})
authRouter.post('/refresh-token', async (req, res, next) => {
  try {
    const getRefreshTokenFormCookie = req.cookies.refresh_token
    if (!getRefreshTokenFormCookie) {
      throw createHttpError.Unauthorized('Invalid refresh token')
    }

    // verify refresh token
    jwt.verify(
      getRefreshTokenFormCookie,
      ENV_CONFIG.JWT.REFRESH_SECRET_KEY,
      function (err, decode) {
        if (err) {
          throw createHttpError.Unauthorized('Invalid refresh token')
        }
      },
    )
    const checkToken = await userModel.findOne({
      refreshToken: getRefreshTokenFormCookie,
    })
    if (!checkToken) {
      throw createHttpError.Unauthorized('Invalid refresh token')
    }

    // create and save tokens
    const token = await generateToken(res, {
      payload: { _id: checkToken._id, role: checkToken.role },
    })

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User token refreshed successfully',
      data: {
        access_token: token.access_token,
      },
    })
  } catch (error) {
    next(error)
  }
})
authRouter.post(`/forgot-password`, async (req, res, next) => {
  try {
    const body = req.body

    // validate data
    const validate = schemaForgotPassword.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    const checkUser = await userModel.findOne({
      email: body.email,
    })
    if (!checkUser) {
      throw createHttpError.NotFound('User not found')
    }
    // token
    generateTokenResetPassword(body.email, {
      email: body.email,
    })

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Reset password link has been sent to your email',
    })
  } catch (error) {
    next(error)
  }
})
authRouter.post(`/reset-password/:token`, async (req, res, next) => {
  try {
    const token = req.params.token
    const body = req.body

    // validate data
    const validate = schemaResetPassword.validate(body)
    if (validate.error) {
      throw createHttpError.BadRequest(validate.error.message)
    }

    // verify token
    jwt.verify(token, ENV_CONFIG.JWT.SECRET_KEY, function (err, decode) {
      if (err) {
        throw createHttpError.Unauthorized('Invalid token')
      }
    })
    const checkToken = await userModel.findOne({
      resetPasswordToken: token,
    })
    if (!checkToken) {
      throw createHttpError.Unauthorized('Invalid token')
    }

    // hash password
    const hashedPassword = await hashPassword(body.password)
    // update password
    await userModel.findByIdAndUpdate(
      checkToken._id,
      { password: hashedPassword, resetPasswordToken: '' },
      { new: true },
    )
    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'Password reset successfully',
    })
  } catch (error) {
    next(error)
  }
})
// verify
authRouter.put(
  `/change-password`,
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const user = req.user
      const body = req.body

      // validate data
      const validate = schemaChangePassword.validate(body)
      if (validate.error) {
        throw createHttpError.BadRequest(validate.error.message)
      }

      // hash password
      const hashedPassword = await hashPassword(body.password)

      // update password
      await userModel.findByIdAndUpdate(
        user?._id,
        { password: hashedPassword },
        { new: true },
      )

      // return
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Password updated successfully',
      })
    } catch (error) {
      next(error)
    }
  },
)
authRouter.get(`/get-me`, authProtectedRouter, async (req, res, next) => {
  try {
    const user = req.user
    const getData = await userModel.findById(user._id)

    // return
    return handleResponse(res, {
      status: StatusCodes.OK,
      message: 'User data fetched successfully',
      data: getData,
    })
  } catch (error) {
    next(error)
  }
})
authRouter.put(
  `/update-me`,
  upload.fields([
    { name: 'fileAvatar', maxCount: 1 },
    { name: 'fileBanner', maxCount: 1 },
  ]),
  authProtectedRouter,
  async (req, res, next) => {
    try {
      const user = req.user
      const body = req.body
      const files = req.files

      const avatarFile = files?.fileAvatar?.[0]
      const bannerFile = files?.fileBanner?.[0]

      // upload file
      let avatar = body.avatar
      let banner = body.banner
      if (avatarFile) {
        avatar = (await uploadImageToCloudinary(avatarFile)).url
        await deleteImageToCloudinary(body.avatar)
      }
      if (bannerFile) {
        banner = (await uploadImageToCloudinary(bannerFile)).url
        await deleteImageToCloudinary(body.avatar)
      }

      // update data
      const updateData = await userModel.findByIdAndUpdate(
        user._id,
        {
          ...body,
          avatar,
          banner,
        },
        { new: true },
      )

      // return
      return handleResponse(res, {
        status: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: updateData,
      })
    } catch (error) {
      next(error)
    }
  },
)
export default authRouter
