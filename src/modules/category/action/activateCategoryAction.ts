'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { CategoryRepository } from '../definitions';

export async function ActivateCategoryAction(id: number) {
  await validateAdminPermission('update', 'Category');
  return new CategoryRepository().activate(id);
}
