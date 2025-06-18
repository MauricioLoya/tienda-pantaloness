'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { CategoryItem, CategoryRepository } from '../definitions';

export async function updateCategoryAction(category: CategoryItem): Promise<CategoryItem> {
  await validateAdminPermission('update', 'Category');
  return await new CategoryRepository().update(category.id, category);
}
