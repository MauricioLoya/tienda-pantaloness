'use server';
import { PromotionInput, PromotionItem, PromotionRepository } from '../definitions';

export async function CreatePromotionAction(data: PromotionInput): Promise<PromotionItem> {
  return new PromotionRepository().create(data);
}
