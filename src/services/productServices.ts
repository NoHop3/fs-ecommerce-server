import Product, { ProductDocument } from '../models/Product'
// import { NotFoundError } from '../helpers/apiError'

const createProduct = async (
  product: ProductDocument
): Promise<ProductDocument> => {
  return product.save()
}

const findProducts = async (): Promise<ProductDocument[]> => {
  return Product.find().sort({ name: 1 })
}

export default {
  createProduct,
  findProducts,
}
