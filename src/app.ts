import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routers/userRouter'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import orderLineRouter from './routers/orderLineRouter'
import orderRouter from './routers/orderRouter'
import productRouter from './routers/productRouter'
import passport from 'passport'
import { jwtStrategy } from './config/passport'

dotenv.config({ path: '.env' })
const app = express()

//Allow CORS access for PORT 5000
const allowerdOrigins = [`hhtp://localhost:${process.env.PORT}`]
const options: cors.CorsOptions = {
  origin: allowerdOrigins,
}
app.use(cors(options))

// Express configuration
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(express.json())
passport.use(jwtStrategy)

// Use movie router
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/orderLines', orderLineRouter)
app.use('/api/v1/orders', orderRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
