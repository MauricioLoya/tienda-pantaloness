'use server'

import { ProductRepository } from '../definitions'

export async function removeCategoryAction(productId: number, categoryId: number) {
  const repo = new ProductRepository()
  return repo.removeCategory(productId, categoryId)
}
