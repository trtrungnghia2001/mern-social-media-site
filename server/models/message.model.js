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
    message: {
      type: String,
    },
    file_url: {
      type: String,
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
  ])
})

const messageModel =
  mongoose.models.message || mongoose.model('message', schema)

export default messageModel
