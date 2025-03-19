"use server";

import { ProductInput, ProductRepository } from "../definitions";

export async function updateProductAction(
  id: number,
  input: Partial<ProductInput>
) {
  const repo = new ProductRepository();
  return repo.updateBasic(id, input);
}
