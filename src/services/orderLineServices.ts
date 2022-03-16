import OrderLine, { OrderLineDocument } from '../models/OrderLine'
import { NotFoundError } from '../helpers/apiError'

const createOrderLine = async (
  orderLine: OrderLineDocument
): Promise<OrderLineDocument> => {
  return orderLine.save()
}

const findOrderLines = async (): Promise<OrderLineDocument[]> => {
  return OrderLine.find().sort({ productId: 1 }).populate('productId')
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
  if (!orderLineToDelete) {
    throw new NotFoundError(`OrderLine ${orderLineId} not found`)
  }
}

export default {
  createOrderLine,
  findOrderLines,
  findById,
  updateById,
  deleteById,
}
