import { prisma } from '@/lib/prima/client'
import { Product, ProductVariant, Prisma } from '@prisma/client'

export type ItemProduct = {
  id: number
  slug: string
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

export type SearchParams = {
  searchQuery?: string
  size?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  regionCode: string
  category?: string
}

interface IProductListRepository {
  getListItem(regionCode: string): Promise<ItemProduct[]>
  productDetail(slug: string): Promise<ProductDetail | null>
  searchProducts(params: SearchParams): Promise<ItemProduct[]>
  getVariantSizes(regionCode: string): Promise<string[]>
  getCategoriesList(
    regionCode: string
  ): Promise<{ label: string; value: number }[]>
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
        slug: product.slug ?? '',
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

  async productDetail(slug: string): Promise<ProductDetail | null> {
    try {
      const product = await prisma.product.findFirst({
        where: { slug },
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

  async searchProducts({
    regionCode,
    searchQuery,
    size,
    minPrice,
    maxPrice,
    sortBy,
    sortDirection,
    category
  }: SearchParams): Promise<ItemProduct[]> {
    console.log('Search params:', {
      regionCode,
      searchQuery,
      size,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection
    })

    try {
      // Build the where condition for search filters
      const where: Prisma.ProductWhereInput = {
        regionId: regionCode,
        active: true
      }

      // Add text search if provided
      if (searchQuery && searchQuery.trim() !== '') {
        // Using Prisma's native capabilities for case-insensitive search
        where.OR = [
          {
            // Search in comma-separated searchWords field
            searchWords: {
              contains: searchQuery.trim(),
              mode: 'insensitive'
            }
          }
        ]
      }

      // Add size filter if provided
      if (size && size.trim() !== '') {
        where.ProductVariant = {
          some: {
            size: size.trim()
          }
        }
      }

      // Apply category filter - filter products that belong to the selected category
      if (category && category.trim() !== '') {
        const categoryId = parseInt(category, 10)
        console.log('Category ID:', categoryId)

        if (!isNaN(categoryId)) {
          where.ProductCategory = {
            some: {
              categoryId: categoryId
            }
          }
        }
      }

      // Add price range filters
      let priceFilter: Prisma.IntFilter | Prisma.FloatFilter | undefined

      if (
        (minPrice && minPrice.trim() !== '') ||
        (maxPrice && maxPrice.trim() !== '')
      ) {
        priceFilter = {}

        if (minPrice && minPrice.trim() !== '') {
          priceFilter.gte = parseFloat(minPrice)
        }

        if (maxPrice && maxPrice.trim() !== '') {
          priceFilter.lte = parseFloat(maxPrice)
        }

        // Apply price filter to base price or variants
        if (size && size.trim() !== '') {
          // If size specified, filter on variant price
          if (!where.ProductVariant) {
            where.ProductVariant = { some: { size: size.trim() } }
          }

          where.ProductVariant.some = {
            ...where.ProductVariant.some,
            price: priceFilter
          }
        } else {
          // Filter on base price
          where.basePrice = priceFilter
        }
      }

      // Build the orderBy condition
      const orderBy: Record<string, 'asc' | 'desc' | undefined> = {}
      if (sortBy && sortBy.trim() !== '') {
        if (sortBy === 'name') {
          orderBy.name = sortDirection
        } else if (sortBy === 'price') {
          orderBy.basePrice = sortDirection
        }
      }

      console.log('Where condition:', JSON.stringify(where, null, 2))
      console.log('Order by:', orderBy)

      // Execute the Prisma query
      const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          ProductImage: {
            select: {
              url: true
            },
            take: 1
          },
          ProductVariant: {
            select: {
              discount: true,
              discountPrice: true
            }
          }
        }
      })

      console.log(`Found ${products.length} products`)

      return products.map(product => {
        // Check for products with discount
        const hasDiscount = product.ProductVariant.some(
          variant => variant.discount > 0 && variant.discountPrice !== null
        )

        return {
          id: product.id,
          slug: product.slug ?? '',
          name: product.name,
          description: product.description,
          price: product.basePrice,
          thumbnail: product.ProductImage[0]?.url ?? 'not-found',
          hasDiscount,
          isAvailable: product.active
        }
      })
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  }

  async getVariantSizes(regionCode: string): Promise<string[]> {
    try {
      // Get all product variants for products in the specific region
      const productVariants = await prisma.productVariant.findMany({
        where: {
          product: {
            regionId: regionCode,
            active: true
          }
        },
        select: {
          size: true
        },
        distinct: ['size']
      })

      // Extract and sort sizes
      const sizes = productVariants.map(variant => variant.size).sort()
      return sizes
    } catch (error) {
      console.error('Error fetching product sizes:', error)
      throw error
    }
  }

  async getCategoriesList(
    regionCode: string
  ): Promise<{ label: string; value: number }[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          regionId: regionCode,
          isDeleted: false
        },
        select: {
          name: true,
          id: true
        }
      })
      return categories.map(category => ({
        label: category.name,
        value: category.id
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }
}
