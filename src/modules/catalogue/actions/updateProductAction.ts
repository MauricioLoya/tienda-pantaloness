'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductInput, ProductRepository } from '../definitions';

export async function updateProductAction(id: number, input: Partial<ProductInput>) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.updateBasic(id, input);
}
