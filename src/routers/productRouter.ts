import { Router } from 'express'
import {
  findProducts,
  createProduct,
  findProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/productController'

const router = Router()

router.get('/', findProducts)
router.post('/', createProduct)
router.get('/:productId', findProductById)
router.put('/:productId', updateProductById)
router.delete('/:productId', deleteProductById)

export default router
