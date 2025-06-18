'use server';

import { ProductInput, ProductRepository } from '../definitions';
import { validateAdminPermission } from '@/lib/auth-validation';

export async function createProductAction(input: ProductInput) {
  // 🔒 Validar permisos para crear productos
  await validateAdminPermission('create', 'Product');

  const repo = new ProductRepository();
  return repo.createBasic(input);
}
