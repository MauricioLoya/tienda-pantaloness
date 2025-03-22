'use server'
import { PromotionRepository } from '../definitions'

export async function DeletePromotionAction(id: number) {
  return new PromotionRepository().delete(id)
}
