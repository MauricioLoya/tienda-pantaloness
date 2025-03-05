'use server'

import { ProductInput, ProductRepository } from '../definitions'

export async function createProductAction(input: ProductInput) {
  const repo = new ProductRepository()
  return repo.createProduct(input)
}
