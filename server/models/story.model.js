import mongoose, { Schema } from 'mongoose'
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Number,
      required: true,
      default: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    },
  },
  {
    timestamps: true,
  },
)

schema.pre('save', function (next) {
  return this.populate(['user'])
})

const storyModel = mongoose.models.story || mongoose.model('story', schema)

export default storyModel
