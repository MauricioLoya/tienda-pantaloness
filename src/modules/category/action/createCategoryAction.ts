'use server';

import { CategoryInput, CategoryItem, CategoryRepository } from '../definitions';
import { validateAdminPermission } from '@/lib/auth-validation';

export async function createCategoryAction(data: CategoryInput): Promise<CategoryItem> {
  // 🔒 Validar permisos para crear categorías
  await validateAdminPermission('create', 'Category');

  return new CategoryRepository().create(data);
}
