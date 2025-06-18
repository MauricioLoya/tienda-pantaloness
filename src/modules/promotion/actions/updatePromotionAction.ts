'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { PromotionItem, PromotionRepository } from '../definitions';

export async function UpdatePromotionAction(data: PromotionItem): Promise<PromotionItem> {
  await validateAdminPermission('update', 'Promotion');
  return await new PromotionRepository().update(data.id, data);
}
