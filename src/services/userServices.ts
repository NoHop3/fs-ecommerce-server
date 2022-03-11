import { NotFoundError } from '../helpers/apiError'
import User, { UserDocument } from '../models/User'
// import { NotFoundError } from '../helpers/apiError'

const createUser = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findUsers = async (): Promise<UserDocument[]> => {
  return User.find().sort({ email: 1 })
}

const findById = async (userId: string): Promise<UserDocument | null> => {
  const userToReturn = await User.findById(userId)
  if (!userToReturn) {
    throw new NotFoundError(`User ${userId} not found`)
  }
  return userToReturn
}

const updateById = async (
  userId: string,
  propsToUpdate: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const userToUpd = await User.findByIdAndUpdate(userId, propsToUpdate, {
    new: true,
  })
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
}
