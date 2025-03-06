'use server'

import { ProductRepository } from '../definitions'

export async function addCategoryAction(productId: number, categoryId: number) {
  const repo = new ProductRepository()
  return repo.addCategory(productId, categoryId)
}
