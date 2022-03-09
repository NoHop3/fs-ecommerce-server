import { Router } from 'express'
import { findProducts, createProduct } from '../controllers/productController'

const router = Router()

router.get('/', findProducts)
router.post('/', createProduct)

export default router
