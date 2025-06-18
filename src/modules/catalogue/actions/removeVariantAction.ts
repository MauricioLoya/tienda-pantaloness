'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function removeVariantAction(variantId: number) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.removeVariant(variantId);
}
