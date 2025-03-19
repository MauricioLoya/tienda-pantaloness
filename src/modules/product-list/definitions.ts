import { prisma } from '@/lib/prima/client'
import { Product, ProductVariant, Prisma } from '@prisma/client'

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

export type SearchParams = {
  searchQuery?: string
  size?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  regionCode: string
}

interface IProductListRepository {
  getListItem(regionCode: string): Promise<ItemProduct[]>
  productDetail(id: number): Promise<ProductDetail | null>
  searchProducts(params: SearchParams): Promise<ItemProduct[]>
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

  async searchProducts({
    regionCode,
    searchQuery,
    size,
    minPrice,
    maxPrice,
    sortBy,
    sortDirection
  }: {
    regionCode: string
    searchQuery?: string
    size?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
  }): Promise<ItemProduct[]> {
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
            name: {
              mode: 'insensitive',
              contains: searchQuery.trim()
            }
          },
          {
            description: {
              mode: 'insensitive',
              contains: searchQuery.trim()
            }
          },
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
      const orderBy: any = {}
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

      // For databases that don't properly handle accents in searches,
      // we can add an additional filtering step in JavaScript but only for searchWords
      let filteredProducts = products

      if (searchQuery && searchQuery.trim() !== '') {
        const normalizedQuery = searchQuery
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        filteredProducts = products.filter(product => {
          // Check if product passes the initial filter
          if (!product.searchWords) return true // Keep products that passed database filter

          // Only normalize searchWords for accent-insensitive comparison
          const normalizedSearchWords = product.searchWords
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

          // Check if comma-separated words contain the query
          const searchWordsList = normalizedSearchWords
            .split(',')
            .map(word => word.trim())

          return searchWordsList.some(word => word.includes(normalizedQuery))
        })
      }

      console.log(`Found ${filteredProducts.length} products`)

      return filteredProducts.map(product => {
        // Check for products with discount
        const hasDiscount = product.ProductVariant.some(
          variant => variant.discount > 0 && variant.discountPrice !== null
        )

        return {
          id: product.id,
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
}
