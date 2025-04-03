'use server';

import { PromotionItem, PromotionRepository } from '../definitions';

export async function UpdatePromotionAction(data: PromotionItem): Promise<PromotionItem> {
  return await new PromotionRepository().update(data.id, data);
}
