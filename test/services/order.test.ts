import OrderLine from '../../src/models/OrderLine'
import Order from '../../src/models/Order'
import User from '../../src/models/User'
import OrderLineService from '../../src/services/orderLineServices'
import OrderService from '../../src/services/orderServices'
import UserService from '../../src/services/userServices'
import ProductService from '../../src/services/productServices'
import connect, { MongodHelper } from '../db-helper'

const nonExistingOrderId = '5e57b77b5744fa0b461c7906'

let product
let orderLine
let user

async function createUser() {
  user = new User({
    email: 'r_geo@gmail.com',
    username: 'Rgeor',
    password: '12344321',
    firstName: 'Rafael',
    lastName: 'Georgio',
  })
  return await UserService.createUser(user)
}
createUser()
const existingUserId = user._id

async function createProduct() {
  product = {
    name: 'Example Product X',
    image: 'http://something.com',
    category: 'Hookahs',
    color: 'Deep Blue Fade',
    price: 49.99,
  }

  return await ProductService.createProduct(product)
}
createProduct()

const existingProductId = product._id

async function createOrderLine() {
  orderLine = new OrderLine({
    productId: existingProductId,
    quantity: 4,
    price: 2.99,
  })
  return await OrderLineService.createOrderLine(orderLine)
}
createOrderLine()

const existingOrderLineId = orderLine._id

async function createOrder() {
  const order = new Order({
    userId: existingUserId,
    orderLines:[
        {_id:existingOrderLineId},
        {_id:existingOrderLineId}
    ],
    totalPrice: 1233
  })
  return await OrderService.createOrder(order)
}

describe('order service', () => {
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
    const order = await createOrder()
    expect(order).toHaveProperty('_id', order._id)
    expect(order).toHaveProperty('userId', existingUserId)
    expect(order).toHaveProperty('totalPrice', 1233.0)
  })

  it('should get a order with id', async () => {
    const order = await createOrder()
    const found = await OrderService.findOrderById(existingUserId, order._id)
    expect(found._id).toEqual(order._id)
    expect(found.userId).toEqual(order.userId)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing order', async () => {
    expect.assertions(1)
    return OrderService.findOrderById(existingUserId, nonExistingOrderId).catch((e) => {
      expect(e.message).toMatch(`Order ${nonExistingOrderId} not found`)
    })
  })

  it('should update an existing order', async () => {
    const order = await createOrder()
    const update = {
      userId: 'Some Other Id',
      totalPrice: 123421,
    }
    const updated = await OrderService.updateOrderById(
      existingUserId,
      order._id,
      update
    )
    expect(updated).toHaveProperty('_id', order._id)
    expect(order).toHaveProperty('userId', update.userId)
  })

  it('should not update a non-existing order', async () => {
    expect.assertions(1)
    const update = {
      totalPrice: 9999,
    }

    return OrderService.updateOrderById(existingUserId, nonExistingOrderId, update).catch(
      (e) => {
        expect(e.message).toMatch(
          `Order ${nonExistingOrderId} not found`
        )
      }
    )
  })

  it('should delete an existing order', async () => {
    expect.assertions(1)
    const order = await createOrder()
    await OrderService.deleteOrderById(existingUserId, order._id)
    return OrderService.findOrderById(existingUserId, order._id).catch((e) => {
      expect(e.message).toBe(`Order ${order._id} not found`)
    })
  })
})
