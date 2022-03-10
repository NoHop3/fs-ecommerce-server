/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  userId: string
  orderLines: []
  totalPrice: number
}

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderLines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderLine',
    },
  ],
  totalPrice: Number,
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
