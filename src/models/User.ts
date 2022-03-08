/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type UserDocument = Document & {
  username: string
  password: string
  firstName: string
  lastName: string
}

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
})

export default mongoose.model<UserDocument>('User', userSchema)
