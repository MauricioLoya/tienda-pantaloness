'use server';
import { validateAdminPermission } from '@/lib/auth-validation';
import { PromotionRepository } from '../definitions';

export async function DeletePromotionAction(id: number) {
  await validateAdminPermission('delete', 'Promotion');
  return new PromotionRepository().delete(id);
}
