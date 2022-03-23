import { Router } from 'express'
import {
  findOrderLines,
  createOrderLine,
  deleteOrderLineById,
  findOrderLineById,
  updateOrderLineById,
  deleteOrderLineByProductId,
} from '../controllers/orderLineController'

const router = Router()

router.get('/:userId', findOrderLines)
router.post('/:userId/:productId', createOrderLine)
router.get('/:userId/:orderLineId', findOrderLineById)
router.put('/:orderLineId', updateOrderLineById)
router.delete('/:orderLineId', deleteOrderLineById)
router.delete('/:userId/:productId', deleteOrderLineByProductId)

export default router
