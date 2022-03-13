import { Router } from 'express'
import passport from 'passport'

import {
  createUser,
  deleteById,
  findById,
  findUsers,
  loginUser,
  updateById,
} from '../controllers/userController'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), findUsers)
router.get('/:userId', findById)
router.post('/', createUser)
router.put('/:userId', updateById)
router.delete('/:userId', deleteById)
router.post('/login', loginUser)

export default router
