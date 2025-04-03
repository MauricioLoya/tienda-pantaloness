'use server';

import { PromotionRepository } from '../definitions';

export async function ActivatePromotionAction(id: number) {
  return new PromotionRepository().activate(id);
}
