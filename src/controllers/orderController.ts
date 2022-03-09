import { Request, Response, NextFunction } from 'express'

import Order from '../models/Order'
import OrderService from '../services/orderServices'
import { BadRequestError } from '../helpers/apiError'

// POST /orders
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderLines, totalPrice } = req.body

    const order = new Order({
      userId: req.params.userId,
      orderLines,
      totalPrice,
    })

    await OrderService.createOrder(order)
    res.json(order)
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /orders for userId
export const findOrdersForUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderService.findOrdersForUserId(req.params.userId))
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /orders
export const findOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await OrderService.findOrders())
  } catch (error) {
    console.log(error)
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
