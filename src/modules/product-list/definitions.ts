import { prisma } from '@/lib/prima/client';
import { Product, ProductVariant, Prisma } from '@prisma/client';

export type ItemProduct = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  discountPercentage: number | null;
  thumbnail: string;
  hasDiscount: boolean;
  isAvailable: boolean;
};

export type ProductDetail = {
  product: Product;
  variants: ProductVariant[];
  images: string[];
};

export type SearchParams = {
  searchQuery?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  regionCode: string;
  category?: string;
};

interface IProductListRepository {
  productDetail(slug: string): Promise<ProductDetail | null>;
  searchProducts(params: SearchParams): Promise<ItemProduct[]>;
  getVariantSizes(regionCode: string): Promise<string[]>;
  getCategoriesList(regionCode: string): Promise<{ label: string; value: number }[]>;
}

export class ProductListRepository implements IProductListRepository {
  async productDetail(slug: string): Promise<ProductDetail | null> {
    try {
      const product = await prisma.product.findFirst({
        where: { slug },
        include: {
          ProductVariant: true,
          ProductImage: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!product) {
        return null;
      }

      return {
        product,
        variants: product.ProductVariant,
        images: product.ProductImage.map(image => image.url),
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
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
    category,
  }: SearchParams): Promise<ItemProduct[]> {
    console.log('Search params:', {
      regionCode,
      searchQuery,
      size,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection,
    });

    try {
      // Build the where condition for search filters
      const where: Prisma.ProductWhereInput = {
        regionId: regionCode,
        active: true,
        // Ensure products have at least one variant
        ProductVariant: {
          some: {},
        },
      };

      // Add text search if provided
      if (searchQuery && searchQuery.trim() !== '') {
        // Using Prisma's native capabilities for case-insensitive search
        where.OR = [
          {
            // Search in comma-separated searchWords field
            searchWords: {
              contains: searchQuery.trim(),
              mode: 'insensitive',
            },
          },
        ];
      }

      // Add size filter if provided
      if (size && size.trim() !== '') {
        where.ProductVariant = {
          some: {
            ...where.ProductVariant?.some,
            size: size.trim(),
          },
        };
      }

      // Apply category filter - filter products that belong to the selected category
      if (category && category.trim() !== '') {
        const categoryId = parseInt(category, 10);

        if (!isNaN(categoryId)) {
          where.ProductCategory = {
            some: {
              categoryId: categoryId,
            },
          };
        }
      }

      // Add price range filters
      let priceFilter: Prisma.IntFilter | Prisma.FloatFilter | undefined;

      if ((minPrice && minPrice.trim() !== '') || (maxPrice && maxPrice.trim() !== '')) {
        priceFilter = {};

        if (minPrice && minPrice.trim() !== '') {
          priceFilter.gte = parseFloat(minPrice);
        }

        if (maxPrice && maxPrice.trim() !== '') {
          priceFilter.lte = parseFloat(maxPrice);
        }

        // Apply price filter to variants
        where.ProductVariant = {
          some: {
            ...where.ProductVariant?.some,
            price: priceFilter,
          },
        };
      }

      // Build the orderBy condition
      const orderBy: Record<string, 'asc' | 'desc' | undefined> = {};
      if (sortBy && sortBy.trim() !== '') {
        if (sortBy === 'name') {
          orderBy.name = sortDirection;
        } else if (sortBy === 'price') {
          orderBy.basePrice = sortDirection;
        }
      }

      // Execute the Prisma query
      const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          ProductImage: {
            select: {
              url: true,
            },
            take: 1,
          },
          ProductVariant: {
            select: {
              price: true,
              discount: true,
              discountPrice: true,
            },
          },
        },
      });

      return products.map(product => {
        // Check for products with discount
        let hasDiscount = false;
        const variantWithLowestDiscount = product.ProductVariant.reduce((prev, current) => {
          if (current.discount && current.discount > 0) {
            hasDiscount = true;
          }
          return current.discount && current.discount < prev.discount ? current : prev;
        }, product.ProductVariant[0]);

        return {
          id: product.id,
          slug: product.slug ?? '',
          name: product.name,
          description: product.description,
          price: variantWithLowestDiscount.price,
          discountedPrice: variantWithLowestDiscount.discountPrice,
          discountPercentage: variantWithLowestDiscount.discount,
          thumbnail: product.ProductImage[0]?.url ?? 'not-found',
          hasDiscount,
          isAvailable: product.active,
        };
      });
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async getVariantSizes(regionCode: string): Promise<string[]> {
    try {
      // Get all product variants for products in the specific region
      const productVariants = await prisma.productVariant.findMany({
        where: {
          product: {
            regionId: regionCode,
            active: true,
          },
        },
        select: {
          size: true,
        },
        distinct: ['size'],
      });

      // Extract and sort sizes
      const sizes = productVariants.map(variant => variant.size).sort();
      return sizes;
    } catch (error) {
      console.error('Error fetching product sizes:', error);
      throw error;
    }
  }

  async getCategoriesList(regionCode: string): Promise<{ label: string; value: number }[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          regionId: regionCode,
          isDeleted: false,
        },
        select: {
          name: true,
          id: true,
        },
      });
      return categories.map(category => ({
        label: category.name,
        value: category.id,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}
