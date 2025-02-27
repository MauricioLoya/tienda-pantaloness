'use server'
import { UserRepository } from '../definitions'
import { User } from '@prisma/client'

export async function createUserAction(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const userRepo = new UserRepository()
  return await userRepo.create({ ...data})
}
