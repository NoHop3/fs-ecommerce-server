import express from 'express'
import dotenv from 'dotenv'

import userRouter from './routers/userRouter'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import orderLineRouter from './routers/orderLineRouter'
import orderRouter from './routers/orderRouter'
import productRouter from './routers/productRouter'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(express.json())

// Use movie router
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orderLines', orderLineRouter)
app.use('/api/v1/orders', orderRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
