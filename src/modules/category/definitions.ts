import { prisma } from '@/lib/prima/client'
import { Category } from '@prisma/client'

interface ICategoryRepository {
  getAll(): Promise<Category[]>
  finsById(id: number): Promise<Category | null>
  update(id: number, data: Category): Promise<Category>
  create(data: Omit<Category, 'id'>): Promise<Category>
  setProduct(id: number, productId: number): Promise<void>
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
      return categories
    } catch (error) {
      throw error
    }
  }

  async setProduct(categoryId: number, productId: number): Promise<void> {
    try {
      const category = await prisma.category.findFirst({
        where: { id: categoryId }
      })

      if (!category) {
        throw new Error('Category not found')
      }

      const product = await prisma.product.findFirst({
        where: { id: productId }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      await prisma.productCategory.create({
        data: {
          categoryId: categoryId,
          productId
        }
      })
    } catch (error) {
      throw error
    }
  }
}
