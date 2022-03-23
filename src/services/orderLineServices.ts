import OrderLine, { OrderLineDocument } from '../models/OrderLine'
import { BadRequestError, NotFoundError } from '../helpers/apiError'

const createOrderLine = async (
  orderLine: OrderLineDocument
): Promise<OrderLineDocument> => {
  const orderLineToReturn = await OrderLine.findOne({
    productId: orderLine.productId,
  })
  if (orderLineToReturn) {
    throw new BadRequestError(
      `Such product ${orderLine.productId} has been already ordered!`
    )
  }
  return await orderLine.save()
}

const findOrderLines = async (userId: string): Promise<OrderLineDocument[]> => {
  return OrderLine.find({ userId: userId })
    .sort({ productId: 1 })
    .populate('productId')
}

const findById = async (orderLineId: string): Promise<OrderLineDocument> => {
  const orderLineToReturn = await OrderLine.findById(orderLineId)
  if (!orderLineToReturn) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
  return orderLineToReturn
}

const updateById = async (
  orderLineId: string,
  propsToUpdate: Partial<OrderLineDocument>
): Promise<OrderLineDocument | null> => {
  const orderLineToUpdate = await OrderLine.findByIdAndUpdate(
    orderLineId,
    propsToUpdate,
    {
      new: true,
    }
  )
  if (!orderLineToUpdate) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
  return orderLineToUpdate
}

const deleteById = async (orderLineId: string): Promise<void> => {
  const orderLineToDelete = await OrderLine.findByIdAndDelete(orderLineId)
  console.log(orderLineToDelete)
  if (!orderLineToDelete) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
}
const deleteByProductId = async (
  userId: string,
  productId: string
): Promise<void> => {
  const orderLineToDelete = await OrderLine.find({
    userId: userId,
    productId: productId,
  })
  if (!orderLineToDelete) {
    throw new NotFoundError(
      `OrderLine containing this product ${productId} not found`
    )
  }
  console.log(orderLineToDelete)
  await OrderLine.deleteOne({
    userId: userId,
    productId: productId,
  })
}

export default {
  createOrderLine,
  findOrderLines,
  findById,
  updateById,
  deleteById,
  deleteByProductId,
}
