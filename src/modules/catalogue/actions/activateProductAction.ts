'use server';

import { ProductRepository } from '../definitions';

export async function activateProductAction(id: number) {
  return await new ProductRepository().activate(id);
}
