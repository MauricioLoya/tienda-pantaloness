import { prisma } from '@/lib/prima/client'

type ItemProduct = {
  id: number
  name: string
  price: number
  thumbnail: string
  hasDiscount: boolean
  isAvailable: boolean
}

interface IProductListRepository {
  getListItem(): Promise<ItemProduct[]>
}

export class ProductListRepository implements IProductListRepository {
  async getListItem(): Promise<ItemProduct[]> {
    try {
      const products = await prisma.product.findMany({
        include: {
          ProductImage: {
            select: {
              url: true
            }
          }
        }
      })
      return products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        thumbnail: product.ProductImage[0].url,
        hasDiscount: false,
        isAvailable: product.active
      }))
    } catch (error) {
      throw error
    }
  }
}
