import { Request, Response, NextFunction } from 'express'

import User from '../models/User'
import UserService from '../services/userServices'
import { BadRequestError } from '../helpers/apiError'

// POST /users
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password, firstName, lastName, image } = req.body

    const checkIfExists = await UserService.checkIfExists(email, username)
    if (checkIfExists)
      return res.status(400).json({ error: 'User already in database.' })

    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      image,
      isAdmin: false,
      hasWriteAccess: false,
      orders: [],
      favourites: [],
    })

    await UserService.createUser(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /users
export const findUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findUsers())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(await UserService.findById(req.params.userId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const updateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await UserService.updateById(
      req.params.userId,
      req.body
    )
    res.json(updatedUser)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

export const deleteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await UserService.deleteById(req.params.userId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
