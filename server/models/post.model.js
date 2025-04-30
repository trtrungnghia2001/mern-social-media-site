import mongoose, { Schema } from 'mongoose'
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    content: {
      type: String,
    },
    file_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ['public', 'only me'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  },
)

schema.pre('save', function () {
  return this.populate([`user`])
})

const postModel = mongoose.models.post || mongoose.model('post', schema)

export default postModel
