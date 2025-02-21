import { prisma } from '@/lib/prima/client'
import bcrypt from 'bcrypt'

interface IAuthRepository {
  loginAdmin: (
    username: string,
    password: string
  ) => Promise<{ email: string; name: string }>
}

export class AuthRepository implements IAuthRepository {
  async loginAdmin(email: string, password: string) {
    const pass = 'securepass'
    const hash = await bcrypt.hash(pass, 10)
    console.log('hash', hash)

    try {
      const userFound = await prisma.user.findUnique({
        where: {
          email
        }
      })
      if (!userFound) {
        throw new Error('User not found')
      }
      const matchPassword = await bcrypt.compare(password, userFound.password)
      if (!matchPassword) throw new Error('Wrong password')
      return { email: userFound.email, name: userFound.name }
    } catch (error) {
      throw error
    }
  }
}
