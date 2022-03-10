import { Router } from 'express'
import {
  findOrderLines,
  createOrderLine,
  deleteOrderLineById,
  findOrderLineById,
  updateOrderLineById,
} from '../controllers/orderLineController'

const router = Router()

router.get('/', findOrderLines)
router.post('/:productId', createOrderLine)
router.get('/:orderLineId', findOrderLineById)
router.put('/:orderLineId', updateOrderLineById)
router.delete('/:orderLineId', deleteOrderLineById)

export default router
