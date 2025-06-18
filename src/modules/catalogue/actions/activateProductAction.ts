'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function activateProductAction(id: number) {
  await validateAdminPermission('update', 'Product');
  return await new ProductRepository().activate(id);
}
