'use server';

import { CategoryRepository } from "../definitions";

export async function ActivateCategoryAction(id: number) {
  return new CategoryRepository().activate(id)
}
