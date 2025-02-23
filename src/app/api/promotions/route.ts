import { NextResponse } from 'next/server'
import { PromotionRepository } from '@/modules/promotion/definitions'

const promotionRepo = new PromotionRepository()

export async function GET() {
  try {
    const promotions = await promotionRepo.getAll()
    return NextResponse.json(promotions)
  } catch (error) {
    return NextResponse.error()
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newPromotionData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
    }
    const promotion = await promotionRepo.create(newPromotionData)
    return NextResponse.json(promotion)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
