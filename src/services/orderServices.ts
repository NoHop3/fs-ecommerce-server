import Order, { OrderDocument } from '../models/Order'
import { NotFoundError } from '../helpers/apiError'

const createOrder = async (order: OrderDocument): Promise<OrderDocument> => {
  return await order.save()
}

const findOrdersForUserId = async (
  userId: string
): Promise<OrderDocument[]> => {
  return await Order.find({ userId: userId })
    .sort({ _id: 1 })
    .populate({
      path: 'userId',
      model: 'User',
    })
    .populate({
      path: 'orderLines',
      model: 'OrderLine',
      populate: {
        path: 'productId',
        model: 'Product',
      },
    })
}

const findOrderById = async (
  userId: string,
  orderId: string
): Promise<OrderDocument> => {
  const orderToReturn = await Order.findOne({ _id: orderId, userId: userId })
  if (!orderToReturn) {
    throw new NotFoundError(`Order ${orderId} not found`)
  }
  return orderToReturn
}

const updateOrderById = async (
  userId: string,
  orderId: string,
  propsToUpdate: Partial<OrderDocument>
): Promise<OrderDocument | null> => {
  const IsOrderMadeBy = await findOrderById(userId, orderId)
  const orderToUpdate = await Order.findByIdAndUpdate(
    IsOrderMadeBy._id,
    propsToUpdate,
    {
      new: true,
    }
  )

  return orderToUpdate
}

const deleteOrderById = async (
  userId: string,
  orderId: string
): Promise<OrderDocument | null> => {
  const IsOrderMadeBy = await findOrderById(userId, orderId)
  const orderToDelete = await Order.findByIdAndDelete(IsOrderMadeBy._id)

  return orderToDelete
}

export default {
  createOrder,
  findOrdersForUserId,
  findOrderById,
  updateOrderById,
  deleteOrderById,
}
