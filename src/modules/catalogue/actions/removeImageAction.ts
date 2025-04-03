'use server';

import { ProductRepository } from '../definitions';

export async function removeImageAction(imageId: number) {
  const repo = new ProductRepository();
  return repo.removeImage(imageId);
}
