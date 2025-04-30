import ENV_CONFIG from '#server/configs/env.config'
import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export async function authProtectedRouter(req, res, next) {
  try {
    const access_token = req.cookies.access_token?.split(' ')?.[1]

    if (!access_token) {
      throw createHttpError.Unauthorized(`Invalid access token`)
    }

    jwt.verify(access_token, ENV_CONFIG.JWT.SECRET_KEY, function (err, decode) {
      if (err) {
        throw createHttpError.Unauthorized(err.message)
      }

      req.user = decode
      next()
    })
  } catch (error) {
    next(error)
  }
}
