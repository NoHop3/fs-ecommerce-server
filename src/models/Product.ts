/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type ProductDocument = Document & {
  name: string
  image: string
  category: string
  price: number
  color: string
}

const productSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, dropDups: true },
  image: { type: String, required: true },
  category: { type: String },
  price: { type: Number },
  color: { type: String },
})

export default mongoose.model<ProductDocument>(
  'Product',
  productSchema,
  'products'
)
