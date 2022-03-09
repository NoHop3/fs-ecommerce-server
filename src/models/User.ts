/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  isAdmin: boolean
  hasWriteAccess: boolean
  orders: []
  favourites: []
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, dropDups: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  isAdmin: { type: Boolean },
  hasWriteAccess: { type: Boolean },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
})

export default mongoose.model<UserDocument>('User', userSchema)
