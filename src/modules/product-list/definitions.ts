import { prisma } from '@/lib/prima/client';
import { Product, Prisma } from '@prisma/client';

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

export type VariantItem = {
  id: number;
  size: string;
  price: number;
  stock: number;
  discount: number;
  discountPrice: number | null;
};

export type ProductDetail = {
  product: Product;
  variants: VariantItem[];
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
        where: {
          slug,
          active: true,
          isDeleted: false,
        },
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
    try {
      const where: Prisma.ProductWhereInput = {
        regionId: regionCode,
        active: true,
        isDeleted: false,
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
      let orderBy:
        | Prisma.ProductOrderByWithRelationInput
        | Prisma.ProductOrderByWithRelationInput[] = {};
      if (sortBy && sortBy.trim() !== '') {
        if (sortBy === 'name') {
          orderBy = { name: sortDirection };
        } else if (sortBy === 'price') {
          orderBy = { createdAt: 'desc' };
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
      const transformedProducts = products.map(product => {
        let hasDiscount = false;
        const variantWithLowestPrice = product.ProductVariant.reduce((prev, current) => {
          if (current.discount && current.discount > 0) {
            hasDiscount = true;
          }
          return current.price < prev.price ? current : prev;
        }, product.ProductVariant[0]);

        return {
          id: product.id,
          slug: product.slug ?? '',
          name: product.name,
          description: product.description,
          price: variantWithLowestPrice.price,
          discountedPrice: variantWithLowestPrice.discountPrice,
          discountPercentage: variantWithLowestPrice.discount,
          thumbnail: product.ProductImage[0]?.url ?? 'not-found',
          hasDiscount,
          isAvailable: product.active,
        };
      });
      if (sortBy === 'price') {
        transformedProducts.sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;

          if (sortDirection === 'asc') {
            return priceA - priceB;
          } else {
            return priceB - priceA;
          }
        });
      }

      return transformedProducts;
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

  async getRelatedProducts(slug: string): Promise<ItemProduct[]> {
    try {
      // Obtener el producto principal para encontrar relacionados
      const product = await this.productDetail(slug);
      if (!product) {
        return [];
      }

      // Extraer información relevante del producto para buscar similares
      const productInfo = {
        categories: await prisma.productCategory.findMany({
          where: { productId: product.product.id },
          select: { categoryId: true },
        }),
        variants: product.variants,
        name: product.product.name,
        regionId: product.product.regionId,
      };

      // Prioridad:
      // 1. Misma categoría,
      // 2. Rango de precio similar,
      // 3. Mismas tallas,
      // 4. Palabras similares en nombre
      const relatedProductsQuery = await prisma.product.findMany({
        where: {
          // Excluir el producto actual
          id: { not: product.product.id },

          // Solo productos activos y disponibles
          active: true,
          isDeleted: false,

          // Misma región
          regionId: productInfo.regionId,

          // Al menos un producto con variante disponible
          ProductVariant: {
            some: {
              stock: { gt: 0 },
            },
          },

          // Condiciones OR para encontrar relaciones
          OR: [
            // 1. Misma categoría (mayor prioridad)
            {
              ProductCategory: {
                some: {
                  categoryId: {
                    in: productInfo.categories.map(c => c.categoryId),
                  },
                },
              },
            },
            // 2. Rango de precio similar (±25%)
            {
              ProductVariant: {
                some: {
                  price: {
                    gte: Math.min(...productInfo.variants.map(v => v.price * 0.75)),
                    lte: Math.max(...productInfo.variants.map(v => v.price * 1.25)),
                  },
                },
              },
            },
            // 3. Palabras clave similares en nombre o descripción
            {
              OR: [
                {
                  name: {
                    contains: productInfo.name.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
                {
                  searchWords: {
                    contains: productInfo.name.split(' ')[0],
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
        // Incluir imágenes y variantes para la respuesta
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
              size: true,
            },
          },
          ProductCategory: {
            select: {
              categoryId: true,
            },
          },
        },
        // Ordenar para dar prioridad a productos que coinciden con más criterios
        orderBy: [
          // Dar prioridad a productos nuevos (creados recientemente)
          { createdAt: 'desc' },
        ],
        // Limitar a 8 resultados
        take: 8,
      });

      // Transformar resultados al formato ItemProduct
      return relatedProductsQuery.map(product => {
        // Encontrar la variante con el precio más bajo para mostrar
        const variantWithLowestPrice = product.ProductVariant.reduce(
          (prev, current) => (current.price < prev.price ? current : prev),
          product.ProductVariant[0]
        );

        // Verificar si alguna variante tiene descuento
        const hasDiscount = product.ProductVariant.some(
          variant => variant.discount && variant.discount > 0
        );

        return {
          id: product.id,
          slug: product.slug ?? '',
          name: product.name,
          description: product.description,
          price: variantWithLowestPrice.price,
          discountedPrice: variantWithLowestPrice.discountPrice,
          discountPercentage: variantWithLowestPrice.discount,
          thumbnail: product.ProductImage[0]?.url ?? 'not-found',
          hasDiscount,
          isAvailable: product.active,
        };
      });
    } catch (error) {
      console.log('Error fetching related products:', error);
      return [];
    }
  }
}
