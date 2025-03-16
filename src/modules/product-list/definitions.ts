import { prisma } from '@/lib/prima/client'
import { Product, ProductVariant } from '@prisma/client'

export type ItemProduct = {
  id: number
  name: string
  description: string
  price: number
  thumbnail: string
  hasDiscount: boolean
  isAvailable: boolean
}

export type ProductDetail = {
  product: Product
  variants: ProductVariant[]
  images: string[]
}

interface IProductListRepository {
  getListItem(regionCode: string): Promise<ItemProduct[]>
  productDetail(id: number): Promise<ProductDetail | null>
}

export class ProductListRepository implements IProductListRepository {
  async getListItem(regionCode: string): Promise<ItemProduct[]> {
    try {
      const products = await prisma.product.findMany({
        include: {
          ProductImage: {
            select: {
              url: true
            }
          }
        },
        where: {
          regionId: regionCode
        }
      })

      return products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.basePrice,
        thumbnail: product.ProductImage[0]?.url ?? 'not-found',
        hasDiscount: false,
        isAvailable: product.active
      }))
    } catch (error) {
      throw error
    }
  }

  async productDetail(id: number): Promise<ProductDetail | null> {
    try {
      const product = await prisma.product.findFirst({
        where: { id },
        include: {
          ProductVariant: true,
          ProductImage: {
            select: {
              url: true
            }
          }
        }
      })

      if (!product) {
        return null
      }

      return {
        product,
        variants: product.ProductVariant,
        images: product.ProductImage.map(image => image.url)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }
}
