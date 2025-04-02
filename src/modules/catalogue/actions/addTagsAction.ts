"use server";

import { ProductRepository } from "../definitions";

export async function addTagsAction(productId: number, tags: string[]) {
  const repo = new ProductRepository();
  const words = tags.join(", ");
  await repo.updateSearchWords(productId, words);
}
