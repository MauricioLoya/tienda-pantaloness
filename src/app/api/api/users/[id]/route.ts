import { NextResponse } from 'next/server'
import { UserRepository } from '@/modules/user/definitions'

const userRepo = new UserRepository()

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const user = await userRepo.getById(Number(resolvedParams.id))
    return NextResponse.json(user)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 })
    }
    const resolvedParams = await params
    const data = await request.json()
    const user = await userRepo.update(Number(resolvedParams.id), data)
    return NextResponse.json(user)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    await userRepo.delete(Number(resolvedParams.id))
    return NextResponse.json({ message: 'Usuario eliminado' })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}
