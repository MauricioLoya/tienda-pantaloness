import { prisma } from '@/lib/prima/client'
import { User } from '@prisma/client'

export interface IUserRepository {
  getAll(): Promise<User[]>
  getById(id: number): Promise<User | null>
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  update(id: number, data: Partial<User>): Promise<User>
  delete(id: number): Promise<void>
}

export class UserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    try {
      return await prisma.user.findMany({ where: { isDeleted: false } })
    } catch (error) {
      throw error
    }
  }
  
  async getById(id: number): Promise<User | null> {
    try {
      return await prisma.user.findUnique({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      return await prisma.user.create({ data: { ...data } })
    } catch (error) {
      throw error
    }
  }
  
  async update(id: number, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data
      })
    } catch (error) {
      throw error
    }
  }
  
  async delete(id: number): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date()
        }
      })
    } catch (error) {
      throw error
    }
  }
}
