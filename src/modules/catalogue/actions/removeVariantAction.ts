'use server'

import { ProductRepository } from '../definitions'

export async function removeVariantAction(variantId: number) {
  const repo = new ProductRepository()
  return repo.removeVariant(variantId)
}
