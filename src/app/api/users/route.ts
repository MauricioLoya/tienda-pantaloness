import { NextResponse } from 'next/server'
import { UserRepository } from '@/modules/user/definitions'

const userRepo = new UserRepository()

export async function GET() {
  try {
    const users = await userRepo.getAll()
    return NextResponse.json(users)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 400 })
    }
    // TO DO: Validate: Only superadmin can create users
    // if is superadmin 
    const data = await request.json()
    const user = await userRepo.create(data)
    if (!user) {
      return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 })
    }
    return NextResponse.json(user)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 })
  }
}
