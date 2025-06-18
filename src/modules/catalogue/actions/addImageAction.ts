'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function addImageAction(productId: number, url: string) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.addImage(productId, url);
}
