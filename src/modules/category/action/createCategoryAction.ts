'use server';

import { CategoryInput, CategoryItem, CategoryRepository } from '../definitions';

export async function createCategoryAction(data: CategoryInput): Promise<CategoryItem> {
  return new CategoryRepository().create(data);
}
