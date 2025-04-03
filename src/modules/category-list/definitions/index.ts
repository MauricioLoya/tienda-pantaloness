import { prisma } from '@/lib/prima/client';
import { ItemProduct } from '@/modules/product-list/definitions';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  active: boolean;
}

export interface CategoryWithProducts {
  category: Category;
  products: ItemProduct[];
}

export class CategoryListRepository {
  async getCategories(locale: string = 'mx'): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
        region: {
          code: locale,
        },
      },
    });

    return categories.map(category => ({
      id: category.id.toString(),
      name: category.name,
      description: category.description,
      active: !category.isDeleted,
      imageUrl: category.backgroundUrl ?? '',
    }));
  }

  async getProductsByCategory(
    categoryId: string,
    limit: number = 4,
    locale: string = 'mx'
  ): Promise<ItemProduct[]> {
    const products = await prisma.product.findMany({
      where: {
        ProductCategory: {
          some: {
            categoryId: parseInt(categoryId),
          },
        },
        active: true,
        region: {
          code: locale,
        },
      },
      include: {
        ProductImage: true,
        ProductVariant: true,
      },
      take: limit,
    });

    return products.map(product => {
      let hasDiscount = false;
      const variantWithLowestDiscount = product.ProductVariant.reduce((prev, current) => {
        if (current.discount && current.discount > 0) {
          hasDiscount = true;
        }
        return current.discount && current.discount < prev.discount ? current : prev;
      }, product.ProductVariant[0]);

      return {
        id: parseInt(product.id.toString()),
        slug: product.slug || '',
        name: product.name,
        description: product.description || '',
        price: variantWithLowestDiscount.price,
        discountedPrice: variantWithLowestDiscount.discountPrice,
        discountPercentage: variantWithLowestDiscount.discount,
        thumbnail: product.ProductImage[0]?.url || 'not-found',
        hasDiscount: hasDiscount,
        isAvailable: Boolean(product.active),
      };
    });
  }

  async getCategoriesWithProducts(
    limit: number = 4,
    locale: string = 'es'
  ): Promise<CategoryWithProducts[]> {
    const categories = await this.getCategories(locale);

    const categoriesWithProducts = await Promise.all(
      categories.map(async category => {
        const products = await this.getProductsByCategory(category.id, limit, locale);
        return { category, products };
      })
    );

    return categoriesWithProducts;
  }
}
