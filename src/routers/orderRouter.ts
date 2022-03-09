import { Router } from 'express'
import {
  findOrders,
  createOrder,
  findOrdersForUserId,
} from '../controllers/orderController'

const router = Router()

router.post('/:userId', createOrder)
router.get('/:userId', findOrdersForUserId)
router.get('/', findOrders)

export default router
