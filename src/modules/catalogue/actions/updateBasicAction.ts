'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository, ProductInput } from '../definitions';

export async function updateBasicAction(productId: number, data: ProductInput) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.updateBasic(productId, data);
}
