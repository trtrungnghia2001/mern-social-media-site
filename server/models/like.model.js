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
  },
  {
    timestamps: true,
  },
)

schema.pre('save', function (next) {
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
        {
          path: 'post',
        },
        {
          path: 'comment',
        },
      ],
    },
  ])
})

const likeModel = mongoose.models.like || mongoose.model('like', schema)

export default likeModel
