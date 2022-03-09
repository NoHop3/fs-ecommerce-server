import { Request, Response, NextFunction } from 'express'

import OrderLine from '../models/OrderLine'
import OrderLineService from '../services/orderLineServices'
import { BadRequestError } from '../helpers/apiError'

// POST /orderLines
export const createOrderLine = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { quantity, price } = req.body

    const orderLine = new OrderLine({
      productId: req.params.productId,
      quantity,
      price,
    })

    await OrderLineService.createOrderLine(orderLine)
    res.json(orderLine)
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /orderLines
export const findOrderLines = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderLineService.findOrderLines())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
