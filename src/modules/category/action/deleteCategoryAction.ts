'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { CategoryRepository } from '../definitions';

export async function deleteCategoryAction(id: number) {
  await validateAdminPermission('delete', 'Category');
  return await new CategoryRepository().delete(id);
}
