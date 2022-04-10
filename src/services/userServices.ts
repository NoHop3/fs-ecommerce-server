import bcrypt from 'bcrypt'

import { NotFoundError } from '../helpers/apiError'
import User, { UserDocument } from '../models/User'
// import { NotFoundError } from '../helpers/apiError'

// Checks

const checkIfExists = async (
  email?: string,
  username?: string
): Promise<UserDocument | null> => {
  const emailInDb = await User.findOne({ email: email })
  if (emailInDb) return emailInDb
  const usernameInDb = await User.findOne({ username: username })
  if (usernameInDb) return usernameInDb
  return null
}

const createUser = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findUsers = async (): Promise<UserDocument[]> => {
  return User.find()
    .sort({ email: 1 })
    .select('-password')
    .populate('favourites')
}

const findById = async (userId: string): Promise<UserDocument | null> => {
  const userToReturn = await User.findById(userId).select('-password')
  if (!userToReturn) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return userToReturn
}

const updateById = async (
  userId: string,
  propsToUpdate: Partial<UserDocument>
): Promise<UserDocument | null> => {
  if (propsToUpdate.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(propsToUpdate.password, salt)
    Object.assign(propsToUpdate, { password: hashedPassword })
  }
  const userToUpd = await User.findByIdAndUpdate(userId, propsToUpdate, {
    new: true,
  }).select('-password')
  if (!userToUpd) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return userToUpd
}

const deleteById = async (userId: string): Promise<void> => {
  const userToDelete = await User.findByIdAndDelete(userId)
  if (!userToDelete) {
    throw new NotFoundError(`User ${userId} not found`)
  }
}

export default {
  createUser,
  findUsers,
  findById,
  updateById,
  deleteById,
  checkIfExists,
}
