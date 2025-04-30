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
  ])
})

const saveModel = mongoose.models.save || mongoose.model('save', schema)

export default saveModel
