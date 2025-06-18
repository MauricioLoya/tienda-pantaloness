'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function removeImageAction(imageId: number) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.removeImage(imageId);
}
