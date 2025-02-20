import { prisma } from '@/lib/prima/client'
import { Product, ProductVariant } from '@prisma/client'

export type ItemProduct = {
  id: number
  name: string
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
  getListItem(): Promise<ItemProduct[]>
  productDetail(id: number): Promise<ProductDetail>
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

  async productDetail(id: number): Promise<ProductDetail> {
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
        throw new Error('Product not found')
      }
      return {
        product,
        variants: product.ProductVariant,
        images: product.ProductImage.map(image => image.url)
      }
    } catch (error) {
      throw error
    }
  }
}
