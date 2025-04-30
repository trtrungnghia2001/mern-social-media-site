import { NOTIFICATION_TYPE } from '#server/constants/notification.constant'
import mongoose, { Schema } from 'mongoose'
const schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: 'post',
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'comment',
    },
    content: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(NOTIFICATION_TYPE),
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

schema.pre('save', function () {
  return this.populate([
    {
      path: 'sender',
    },
    {
      path: 'receiver',
    },
    {
      path: 'post',
      populate: [
        {
          path: 'user',
        },
      ],
    },
    {
      path: 'comment',
      populate: [
        {
          path: 'user',
        },
      ],
    },
  ])
})
schema.pre('find', function (next) {
  this.populate([
    {
      path: 'sender',
    },
    {
      path: 'receiver',
    },
    {
      path: 'post',
      populate: [
        {
          path: 'user',
        },
      ],
    },
    {
      path: 'comment',
      populate: [
        {
          path: 'user',
        },
      ],
    },
  ])
  next()
})

const notificationModel =
  mongoose.models.notification || mongoose.model('notification', schema)

export default notificationModel
