'use server'

import { ProductRepository } from '../definitions'

export async function addVariantAction(productId: number, size: string, price: number, stock: number) {
  const repo = new ProductRepository()
  return repo.addVariant(productId, size, price, stock)
}
