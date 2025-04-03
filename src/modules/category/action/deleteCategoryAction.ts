'use server';

import { CategoryRepository } from '../definitions';

export async function deleteCategoryAction(id: number) {
  return await new CategoryRepository().delete(id);
}
