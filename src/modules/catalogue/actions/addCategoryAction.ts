'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function addCategoryAction(productId: number, categoryId: number) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.addCategory(productId, categoryId);
}
