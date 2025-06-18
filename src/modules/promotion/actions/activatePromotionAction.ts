'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { PromotionRepository } from '../definitions';

export async function ActivatePromotionAction(id: number) {
  await validateAdminPermission('update', 'Promotion');
  return new PromotionRepository().activate(id);
}
