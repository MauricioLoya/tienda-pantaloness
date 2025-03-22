"use server";

import { CategoryItem, CategoryRepository } from "../definitions";

export async function updateCategoryAction(
  category: CategoryItem
): Promise<CategoryItem> {
  return await new CategoryRepository().update(category.id, category);
}
