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

// GET /order by ID
export const findOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(
      await OrderService.findOrderById(req.params.userId, req.params.orderId)
    )
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /:orderId
export const updateOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(
      await OrderService.updateOrderById(
        req.params.userId,
        req.params.orderId,
        req.body
      )
    )
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /:orderId
export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(
      await OrderService.deleteOrderById(req.params.userId, req.params.orderId)
    )
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
