'use server';
import { validateAdminPermission } from '@/lib/auth-validation';
import { PromotionInput, PromotionItem, PromotionRepository } from '../definitions';

export async function CreatePromotionAction(data: PromotionInput): Promise<PromotionItem> {
  await validateAdminPermission('create', 'Promotion');
  return new PromotionRepository().create(data);
}
