'use server'
import { UserRepository } from '../definitions'

export async function deleteUserAction(id: number): Promise<void> {
  const userRepo = new UserRepository()
  await userRepo.delete(id)
}
