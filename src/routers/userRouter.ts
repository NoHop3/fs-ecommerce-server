import { Router } from 'express'

import {
  createUser,
  deleteById,
  findById,
  findUsers,
  updateById,
} from '../controllers/userController'

const router = Router()

router.get('/', findUsers)
router.get('/:userId', findById)
router.post('/', createUser)
router.put('/:userId', updateById)
router.delete('/:userId', deleteById)

export default router
