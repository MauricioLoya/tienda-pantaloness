"use server";

import { ProductRepository } from "../definitions";

export async function deleteProductAction(id: number) {
  const repo = new ProductRepository();
  return repo.deleteProduct(id);
}
