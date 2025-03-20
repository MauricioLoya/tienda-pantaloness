import { ItemProduct } from '@/modules/product-list/definitions'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  active: boolean
}

export interface CategoryWithProducts {
  category: Category
  products: ItemProduct[]
}

import { PrismaClient } from '@prisma/client'

export class CategoryListRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getCategories(locale: string = 'es'): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        isDeleted: false,
        region: {
          code: locale
        }
      }
    })

    return categories.map(category => ({
      id: category.id.toString(),
      name: category.name,
      slug: this.slugify(category.name),
      description: category.description,
      active: !category.isDeleted
    }))
  }

  async getProductsByCategory(
    categoryId: string,
    limit: number = 4,
    locale: string = 'es'
  ): Promise<ItemProduct[]> {
    const products = await this.prisma.product.findMany({
      where: {
        ProductCategory: {
          some: {
            categoryId: parseInt(categoryId)
          }
        },
        active: true,
        region: {
          code: locale
        }
      },
      include: {
        ProductImage: true,
        ProductVariant: true
      },
      take: limit
    })

    return products.map(product => ({
      id: parseInt(product.id.toString()),
      slug: product.slug || '',
      name: product.name,
      description: product.description || '',
      price: Number(product.basePrice) || 0,
      thumbnail: product.ProductImage[0]?.url || '',
      hasDiscount: Boolean(product.active),
      isAvailable: Boolean(product.active)
    }))
  }

  async getCategoriesWithProducts(
    limit: number = 4,
    locale: string = 'es'
  ): Promise<CategoryWithProducts[]> {
    const categories = await this.getCategories(locale)

    const categoriesWithProducts = await Promise.all(
      categories.map(async category => {
        const products = await this.getProductsByCategory(
          category.id,
          limit,
          locale
        )
        return { category, products }
      })
    )

    return categoriesWithProducts
  }

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  }
}
