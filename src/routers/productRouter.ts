import { Router } from 'express'

import { isAdmin } from '../middlewares/isAdmin'
import { hasWriteAccess } from '../middlewares/hasWriteAccess'
import {
  findProducts,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/productController'
import passport from 'passport'

const router = Router()

router.get('/', findProducts)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  hasWriteAccess,
  createProduct
)
router.get('/:productId', findProductById)
router.put(
  '/:productId',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updateProductById
)
router.delete(
  '/:productId',
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteProductById
)

export default router
