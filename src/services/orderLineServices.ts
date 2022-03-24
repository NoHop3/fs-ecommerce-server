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
  const returnOrderLine = await orderLine.save()
  return returnOrderLine.populate('productId').execPopulate()
}

const findOrderLines = async (userId: string): Promise<OrderLineDocument[]> => {
  return OrderLine.find({ userId: userId })
    .sort({ productId: 1 })
    .populate('productId')
}

const findById = async (orderLineId: string): Promise<OrderLineDocument> => {
  const orderLineToReturn = await OrderLine.findById(orderLineId).populate(
    'productId'
  )
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
  ).populate('productId')
  if (!orderLineToUpdate) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
  return orderLineToUpdate
}

const deleteById = async (orderLineId: string): Promise<void> => {
  const orderLineToDelete = await OrderLine.findByIdAndDelete(orderLineId)
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
  await OrderLine.deleteOne({
    userId: userId,
    productId: productId,
  })
}

const deleteAll = async (userId: string): Promise<void> => {
  try {
    await OrderLine.deleteMany({ userId: userId })
  } catch (error) {
    console.log(error)
  }
}

export default {
  createOrderLine,
  findOrderLines,
  findById,
  updateById,
  deleteById,
  deleteByProductId,
  deleteAll,
}
