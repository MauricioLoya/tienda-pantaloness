'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function addVariantAction(
  productId: number,
  size: string,
  price: number,
  stock: number,
  discount?: number
) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  return repo.addVariant(productId, size, price, stock, discount);
}
