'use server';

import { CategoryRepository } from "../definitions";

export async function deleteCategoryAction(id: number) {
  return new CategoryRepository().delete(id)
}
