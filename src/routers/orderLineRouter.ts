import { Router } from 'express'
import {
  findOrderLines,
  createOrderLine,
} from '../controllers/orderLineController'

const router = Router()

router.get('/', findOrderLines)
router.post('/:productId', createOrderLine)

export default router
