import Order, { OrderDocument } from '../models/Order'
// import { NotFoundError } from '../helpers/apiError'

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  return order.save()
}

const findOrders = async (): Promise<OrderDocument[]> => {
  return Order.find().sort({ userId: 1 }).populate('userId').populate('orders')
}

const findOrdersForUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  return Order.find({ userId: userId }).sort({ _id: 1 }).populate('orders')
}

export default {
  createOrder,
  findOrders,
  findOrdersForUserId,
}
