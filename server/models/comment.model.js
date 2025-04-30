import mongoose, { Schema } from 'mongoose'
const schema = new Schema(
  {
    user: {
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
      path: 'user',
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

const commentModel =
  mongoose.models.comment || mongoose.model('comment', schema)

export default commentModel
