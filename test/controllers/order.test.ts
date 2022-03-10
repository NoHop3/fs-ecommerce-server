import request from 'supertest'

import { OrderDocument } from '../../src/models/Order'
import app from '../../src/app'
import connect, { MongodHelper } from '../db-helper'
import { UserDocument } from '../../src/models/User'
import { OrderLineDocument } from '../../src/models/OrderLine'
import { ProductDocument } from '../../src/models/Product'

const nonExistingOrderId = '5e57b77b5744fa0b461c7906'

//! Insert existing orderLines in order to test or create a order here
//! Insert existing userId in order to test or create a order here
//! Insert existing productId in order to test or create an order here
let product
let user
let orderLine

async function createProduct(override?: Partial<ProductDocument>) {
  product = {
    name: 'Example Product X',
    image: 'http://something.com',
    category: 'Hookahs',
    color: 'Deep Blue Fade',
    price: 49.99,
  }

  if (override) {
    product = { ...product, ...override }
  }

  return await request(app).post('/api/v1/products').send(product)
}
createProduct()

const existingProductId = product._id

async function createOrderLine(override?: Partial<OrderLineDocument>) {
  orderLine = {
    productId: existingProductId,
    quantity: 4,
    price: 2.99,
  }

  if (override) {
    orderLine = { ...orderLine, ...override }
  }

  return await request(app)
    .post(`/api/v1/orderLines/${existingProductId}`)
    .send(orderLine)
}
createOrderLine()

async function createUser(override?: Partial<UserDocument>) {
  user = {
    email: 'r_g@gmail.com',
    username: 'Rg',
    password: '12344321',
    firstName: 'R',
    lastName: 'Ge',
  }

  if (override) {
    user = { ...user, ...override }
  }

  return await request(app).post('/api/v1/users').send(user)
}
createUser()

const existingUserId = user._id
const existingOrderLineId = '5e57b77b5744fa0b461c7906'

async function createOrder(override?: Partial<OrderDocument>) {
  let order = {
    userId: existingUserId,
    orderLines: [{ _id: existingOrderLineId }, { _id: existingOrderLineId }],
    totalPrice: 123.0,
  }

  if (override) {
    order = { ...order, ...override }
  }

  return await request(app).post(`/api/v1/orders${existingUserId}`).send(order)
}

describe('order controller', () => {
  let mongodHelper: MongodHelper

  beforeAll(async () => {
    mongodHelper = await connect()
  })

  afterEach(async () => {
    await mongodHelper.clearDatabase()
  })

  afterAll(async () => {
    await mongodHelper.closeDatabase()
  })

  it('should create a order', async () => {
    const res = await createOrder()
    expect(res.status).toBe(200)
    expect(res.body.userId).toEqual(existingUserId)
    expect(res.body.totalPrice).toEqual(123.0)
  })

  it('should not create a order with wrong data', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        orderLines: [
          { _id: existingOrderLineId },
          { _id: existingOrderLineId },
        ],
        totalPrice: 123.0,
        // These fields should be included
        // userId: existingUserId
      })
    expect(res.status).toBe(400)
  })

  it('should get back an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)

    const orderId = res.body._id
    res = await request(app).get(`/api/v1/orders/${existingUserId}/${orderId}`)

    expect(res.body._id).toEqual(orderId)
  })

  it('should not get back a non-existing order', async () => {
    const res = await request(app).get(`/api/v1/orders/${existingUserId}/${nonExistingOrderId}`)
    expect(res.status).toBe(404)
  })

  it('should get back all order', async () => {
    const res1 = await createOrder({
      userId: existingUserId,
      orderLines: [],
      totalPrice: 1231
    })
    const res2 = await createOrder({
      userId: existingUserId,
      orderLines: [],
      totalPrice: 1231,
    })

    const res3 = await request(app).get(`/api/v1/orders/${existingUserId}`)

    expect(res3.body.length).toEqual(2)
    expect(res3.body[0]._id).toEqual(res1.body._id)
    expect(res3.body[1]._id).toEqual(res2.body._id)
  })

  it('should update an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)

    const orderId = res.body._id
    const update = {
      totalPrice: 9991,
    }

    res = await request(app)
      .put(`/api/v1/orders/${existingUserId}/${orderId}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.body.totalPrice).toEqual(9991)
  })

  it('should delete an existing order', async () => {
    let res = await createOrder()
    expect(res.status).toBe(200)
    const orderId = res.body._id

    res = await request(app).delete(
      `/api/v1/orders/${existingUserId}/${orderId}`
    )

    expect(res.status).toEqual(204)

    res = await request(app).get(`/api/v1/orders/${existingUserId}/${orderId}`)
    expect(res.status).toBe(404)
  })
})
