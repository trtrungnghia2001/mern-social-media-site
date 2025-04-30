import mongoose, { Schema } from 'mongoose'
const schema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

schema.pre('save', function (next) {
  return this.populate([
    {
      path: 'follower',
    },
    {
      path: 'following',
    },
  ])
})

const followModel = mongoose.models.follow || mongoose.model('follow', schema)

export default followModel
