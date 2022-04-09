/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type Product = {
  productId: string
}

export type UserDocument = Document & {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  image?: string
  isAdmin: boolean
  hasWriteAccess: boolean
  favourites: Product[]
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, dropDups: true },
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  image: { type: String },
  isAdmin: { type: Boolean },
  hasWriteAccess: { type: Boolean },
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
})

export default mongoose.model<UserDocument>('User', userSchema, 'users')
