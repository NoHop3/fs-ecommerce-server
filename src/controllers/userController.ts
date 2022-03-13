import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import UserService from '../services/userServices'
import { BadRequestError, NotFoundError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'

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
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = new User({
      email,
      username,
      password: hashedPassword,
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body
    const loginUser = await UserService.checkIfExists(email, username)
    if (loginUser) {
      const isCorrectPassword = await bcrypt.compare(
        password,
        loginUser.password
      )
      if (!isCorrectPassword) {
        return next(new BadRequestError(`Password ${password} is incorrect`))
      } else {
        const token = jwt.sign(
          {
            userId: loginUser._id,
            email: loginUser.email,
            username: loginUser.username,
          },
          JWT_SECRET,
          {
            expiresIn: '1hr',
          }
        )
        res.json({ token, loginUser })
      }
    } else {
      next(new NotFoundError('User not in database'))
    }
    // return res.status(400).json({ error: 'User not in database.' })
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
