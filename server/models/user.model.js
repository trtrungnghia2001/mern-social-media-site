import { GENDER, ROLE } from '#server/constants/user.constant'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
      required: true,
    },
    avatar: {
      type: String,
    },
    banner: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    birthday: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    work: {
      type: String,
    },
    education: {
      type: String,
    },
    skills: {
      type: String,
    },
    bio: {
      type: String,
    },

    // link
    link_website: {
      type: String,
    },

    // provider
    providerGoogle: {
      type: String,
    },
    providerFacebook: {
      type: String,
    },
    providerGithub: {
      type: String,
    },

    // token
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

const userModel = mongoose.models.user || mongoose.model('user', schema)

export default userModel
