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
      userId: req.params.userId,
      quantity,
      price,
    })

    await OrderLineService.createOrderLine(orderLine)
    res.json(orderLine)
  } catch (error) {
    // console.log(error)
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
    res.json(await OrderLineService.findOrderLines(req.params.userId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /orderLine by ID
export const findOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderLineService.findById(req.params.orderLineId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /:orderLineId
export const updateOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedOrderLine = await OrderLineService.updateById(
      req.params.orderLineId,
      req.body
    )
    res.json(updatedOrderLine)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /:orderLineId
export const deleteOrderLineById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await OrderLineService.deleteById(req.params.orderLineId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /:productId
export const deleteOrderLineByProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await OrderLineService.deleteByProductId(
      req.params.userId,
      req.params.productId
    )
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      console.log(error)
      next(error)
    }
  }
}
