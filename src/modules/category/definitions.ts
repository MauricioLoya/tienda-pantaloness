import { prisma } from '@/lib/prima/client'
import { Category } from '@prisma/client'

interface ICategoryRepository {
  getAll(): Promise<Category[]>
  finsById(id: number): Promise<Category | null>
  update(id: number, data: Category): Promise<Category>
  create(data: Omit<Category, 'id'>): Promise<Category>
}

export class CategoryRepository implements ICategoryRepository {
  finsById(id: number): Promise<Category | null> {
    try {
      const found = prisma.category.findFirst({
        where: { id }
      })
      return found
    } catch (error) {
      throw error
    }
  }
  update(id: number, data: Category): Promise<Category> {
    try {
      const updated = prisma.category.update({
        where: { id },
        data
      })
      return updated
    } catch (error) {
      throw error
    }
  }
  create(data: Omit<Category, 'id'>): Promise<Category> {
    try {
      const created = prisma.category.create({
        data
      })
      return created
    } catch (error) {
      throw error
    }
  }
  async getAll(): Promise<Category[]> {
    try {
      const categories = prisma.category.findMany()
      await setTimeout(() => {}, 1000)
      return categories
    } catch (error) {
      throw error
    }
  }
}
