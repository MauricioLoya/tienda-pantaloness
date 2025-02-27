'use server'
import { UserRepository } from '../definitions'
import { User } from '@prisma/client'

export async function updateUserAction(id: number, data: Partial<User>): Promise<User> {
  const userRepo = new UserRepository()
  return await userRepo.update(id, data)
}
