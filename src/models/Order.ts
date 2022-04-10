/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type OrderLine = {
  _id: string
}

export type OrderDocument = Document & {
  userId: string
  orderedlines: OrderLine[]
  totalPrice: number
}

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPrice: Number,
  orderedlines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderLine',
    },
  ],
})

export default mongoose.model<OrderDocument>('Order', orderSchema, 'orders')
