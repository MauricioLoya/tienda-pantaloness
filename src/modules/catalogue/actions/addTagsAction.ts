'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { ProductRepository } from '../definitions';

export async function addTagsAction(productId: number, tags: string[]) {
  await validateAdminPermission('update', 'Product');
  const repo = new ProductRepository();
  const words = tags.join(', ');
  await repo.updateSearchWords(productId, words);
}
