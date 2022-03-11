import Product from '../../src/models/Product'
import ProductService from '../../src/services/productServices'
import connect, { MongodHelper } from '../db-helper'

const nonExistingProductId = '5e57b77b5744fa0b461c7906'

async function createProduct() {
  const product = new Product({
    name: 'Example Product X',
    image: 'http://something.com',
    category: 'Hookahs',
    color: 'Deep Blue Fade',
    price: 49.99,
  })
  return await ProductService.createProduct(product)
}

describe('product service', () => {
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

  it('should create a product', async () => {
    const product = await createProduct()
    expect(product).toHaveProperty('_id', product._id)
    expect(product).toHaveProperty('name', 'Example Product X')
    expect(product).toHaveProperty('image', 'http://something.com')
  })

  it('should get a product with id', async () => {
    const product = await createProduct()
    const found = await ProductService.findById(product._id)
    expect(found.name).toEqual(product.name)
    expect(found._id).toEqual(product._id)
  })

  // Check https://jestjs.io/docs/en/asynchronous for more info about
  // how to test async code, especially with error
  it('should not get a non-existing product', async () => {
    expect.assertions(1)
    return ProductService.findById(nonExistingProductId).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should update an existing product', async () => {
    const product = await createProduct()
    const update = {
      name: 'Example Product Updated',
      image: 'http://somethingUpdated.com',
      category: 'Hookahs',
      color: 'Deep Blue Fade',
      price: 49.99,
    }
    const updated = await ProductService.updateById(product._id, update)
    expect(updated).toHaveProperty('_id', product._id)
    expect(updated).toHaveProperty('name', 'Example Product Updated')
    expect(updated).toHaveProperty('image', 'http://somethingUpdated.com')
  })

  it('should not update a non-existing product', async () => {
    expect.assertions(1)
    const update = {
      name: 'Example Product Updated',
      image: 'http://somethingUpdated.com',
      category: 'Hookahs',
      color: 'Deep Blue Fade',
      price: 49.99,
    }

    return await ProductService.updateById(nonExistingProductId, update).catch((e) => {
      expect(e.message).toMatch(`Product ${nonExistingProductId} not found`)
    })
  })

  it('should delete an existing product', async () => {
    expect.assertions(1)
    const product = await createProduct()
    await ProductService.deleteById(product._id)
    return ProductService.findById(product._id).catch((e) => {
      expect(e.message).toBe(`Product ${product._id} not found`)
    })
  })
  it('should not delete a non-existing product', async () => {
    expect.assertions(1)
    return await ProductService.deleteById(nonExistingProductId).catch((e) => {
      expect(e.message).toBe(`Product ${nonExistingProductId} not found`)
    })
  })
})
