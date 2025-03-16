'use server'
import { PromotionRepository } from '../definitions'
import { Promotion } from '@prisma/client'

export async function createPromotionAction(data: Omit<Promotion, 'id' | 'createdAt' | 'isDeleted'>): Promise<Promotion> {
  const promotionRepo = new PromotionRepository()
  return await promotionRepo.create(data)
}
