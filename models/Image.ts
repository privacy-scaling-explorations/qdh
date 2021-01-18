import mongoose from 'mongoose'
import { createSchema, Type, typedModel } from 'ts-mongoose'

const ImageSchema = createSchema(
  {
    hash: Type.string({ required: true }),
    index: Type.number({ unique: true, index: true }),
    url: Type.string({ required: true }),
    removed: Type.boolean({ default: false }),
  },
  { timestamps: true }
)

export default mongoose.models.Image || typedModel('Image', ImageSchema)
