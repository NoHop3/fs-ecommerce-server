import Product, { ProductDocument } from '../models/Product'
import { NotFoundError } from '../helpers/apiError'

const createProduct = async (
  product: ProductDocument
): Promise<ProductDocument> => {
  return await product.save()
}

const findProducts = async (): Promise<ProductDocument[]> => {
  return Product.find().sort({ name: 1 })
}

const findById = async (productId: string): Promise<ProductDocument> => {
  const productToReturn = await Product.findById(productId)
  if (!productToReturn) {
    throw new NotFoundError(`Product ${productId} not found`)
  }
  return productToReturn
}

const updateById = async (
  productId: string,
  propsToUpdate: Partial<ProductDocument>
): Promise<ProductDocument | null> => {
  const productToUpdate = await Product.findByIdAndUpdate(
    productId,
    propsToUpdate,
    {
      new: true,
    }
  )
  if (!productToUpdate) {
    throw new NotFoundError(`Product ${productId} not found`)
  }
  return productToUpdate
}

const deleteById = async (productId: string): Promise<void> => {
  const productToDelete = await Product.findByIdAndDelete(productId)
  if (!productToDelete) {
    throw new NotFoundError(`Product ${productId} not found`)
  }
}

export default {
  createProduct,
  findById,
  findProducts,
  updateById,
  deleteById,
}
