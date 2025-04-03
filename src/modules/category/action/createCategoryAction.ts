'use server';

import { CategoryItem, CategoryRepository } from '../definitions';

export async function createCategoryAction(
  name: string,
  description: string,
  regionId: string
): Promise<CategoryItem> {
  return new CategoryRepository().create({
    name: name,
    description: description,
    regionId: regionId,
  });
}
