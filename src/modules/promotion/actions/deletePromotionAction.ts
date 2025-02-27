'use server'
import { PromotionRepository } from '../definitions'

export async function deletePromotionAction(id: number): Promise<void> {
  const promotionRepo = new PromotionRepository()
  await promotionRepo.delete(id)
}
