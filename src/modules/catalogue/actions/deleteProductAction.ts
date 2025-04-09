'use server';

import { ProductRepository } from '../definitions';

export async function deleteProductAction(id: number) {
  return await new ProductRepository().delete(id);
}
