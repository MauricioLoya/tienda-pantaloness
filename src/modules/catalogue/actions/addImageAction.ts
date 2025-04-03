'use server';

import { ProductRepository } from '../definitions';

export async function addImageAction(productId: number, url: string) {
  const repo = new ProductRepository();
  return repo.addImage(productId, url);
}
