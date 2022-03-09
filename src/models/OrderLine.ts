/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type OrderLineDocument = Document & {
  productId: string
  quantity: number
  price: number
}

const orderLineSchema = new mongoose.Schema({
  productId: {
    Type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { Type: Number, default: 1 },
  price: Number,
})

export default mongoose.model<OrderLineDocument>('OrderLine', orderLineSchema)
