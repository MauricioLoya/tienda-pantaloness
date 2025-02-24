import { NextResponse } from 'next/server'
import { PromotionRepository } from '@/modules/promotion/definitions'

const promotionRepo = new PromotionRepository()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const promotion = await promotionRepo.getById(Number(resolvedParams.id))
    return NextResponse.json(promotion)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('PUT')
    const resolvedParams = await params
    const data = await request.json()
    const updatedData = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
    }
    const promotion = await promotionRepo.update(Number(resolvedParams.id), updatedData)
    return NextResponse.json(promotion)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    await promotionRepo.delete(Number(resolvedParams.id))
    return NextResponse.json({ message: 'Promoción eliminada' })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}
