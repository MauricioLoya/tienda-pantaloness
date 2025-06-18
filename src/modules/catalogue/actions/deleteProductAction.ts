'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function deleteProductAction(id: number) {
  await validateAdminPermission('delete', 'Product');
  return await new ProductRepository().delete(id);
}
