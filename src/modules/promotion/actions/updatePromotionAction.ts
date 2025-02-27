'use server'
import { PromotionRepository } from '../definitions'
import { Promotion } from '@prisma/client'

export async function updatePromotionAction(id: number, data: Partial<Promotion>): Promise<Promotion> {
  const promotionRepo = new PromotionRepository()
  return await promotionRepo.update(id, data)
}
