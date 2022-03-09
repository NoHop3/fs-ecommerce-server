import OrderLine, { OrderLineDocument } from '../models/OrderLine'
// import { NotFoundError } from '../helpers/apiError'

const createOrderLine = async (
  orderLine: OrderLineDocument
): Promise<OrderLineDocument> => {
  return orderLine.save()
}

const findOrderLines = async (): Promise<OrderLineDocument[]> => {
  return OrderLine.find().sort({ productId: 1 }).populate('productId')
}

export default {
  createOrderLine,
  findOrderLines,
}
