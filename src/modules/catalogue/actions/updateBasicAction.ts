'use server';

import { ProductRepository, ProductInput } from '../definitions';

export async function updateBasicAction(productId: number, data: ProductInput) {
  const repo = new ProductRepository();
  return repo.updateBasic(productId, data);
}
