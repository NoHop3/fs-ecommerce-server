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
      orderLineId: req.params.orderLineId,
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
    res.json(
      await OrderLineService.updateById(req.params.orderLineId, req.body)
    )
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
    res.json(await OrderLineService.deleteById(req.params.orderLineId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
