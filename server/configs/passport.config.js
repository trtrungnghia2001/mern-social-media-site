import passportConfig from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as GithubStrategy } from 'passport-github2'
import ENV_CONFIG from './env.config.js'
import userModel from '#server/models/user.model'
import { hashPassword } from '#server/utils/auth.util'

// google
passportConfig.use(
  new GoogleStrategy(
    {
      clientID: ENV_CONFIG.PASSPORT.GOOGLE_CLIENT_ID,
      clientSecret: ENV_CONFIG.PASSPORT.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV_CONFIG.PASSPORT.GOOGLE_CALLBACK_URL,
      scope: [`profile`, `email`],
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = profile._json

      // check exists user
      let userExists = await userModel.findOneAndUpdate(
        {
          email: body.email,
        },
        {
          providerGoogle: body.sub,
        },
        {
          new: true,
        },
      )

      if (!userExists) {
        // hash password
        const hashedPassword = await hashPassword(body.sub)
        userExists = await userModel.create({
          email: body.email,
          password: hashedPassword,
          name: body.name,
          avatar: body.avatar,
          providerGoogle: body.sub,
        })
      }

      done(null, userExists)
    },
  ),
)
// github
passportConfig.use(
  new GithubStrategy(
    {
      clientID: ENV_CONFIG.PASSPORT.GITHUB_CLIENT_ID,
      clientSecret: ENV_CONFIG.PASSPORT.GITHUB_CLIENT_SECRET,
      callbackURL: ENV_CONFIG.PASSPORT.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      const body = { ...profile._json, email: profile.emails?.[0].value }
      // check exists user
      let userExists = await userModel.findOneAndUpdate(
        {
          email: body.email,
        },
        {
          providerGithub: body.id,
        },
        {
          new: true,
        },
      )
      if (!userExists) {
        // hash password
        const hashedPassword = await hashPassword(body.sub)
        userExists = await userModel.create({
          email: body.email,
          password: hashedPassword,
          name: body.name,
          avatar: body.avatar,
          providerGithub: body.id,
        })
      }

      done(null, userExists)
    },
  ),
)

passportConfig.serializeUser(function (user, done) {
  done(null, user)
})
passportConfig.deserializeUser(function (user, done) {
  done(null, user)
})

export default passportConfig
