import { prisma } from "@/lib/prima/client";
import { Product } from "@prisma/client";

export interface ProductInput {
  name: string;
  description: string;
  basePrice: number;
  active: boolean;
  images?: { url: string }[];
  categories?: { categoryId: number }[];
  variants?: { size: string; price: number; stock: number }[];
}

export type ImageItem = {
  id: number;
  url: string;
};

export type CategoryItem = {
  id: number;
  name: string;
  description: string;
};

export type VariantItem = {
  id: number;
  size: string;
  price: number;
  stock: number;
};

export type ProductDetail = {
  product: Product;
  images: ImageItem[];
  categories: CategoryItem[];
  variants: VariantItem[];
};

export type ProductAdminTableRow = {
  id: number;
  name: string;
  basePrice: number;
  active: boolean;
  categories: string;
  createdAt: Date;
};

interface IProductRepository {
  createProduct(input: ProductInput): Promise<Product>;
  getProductById(id: number): Promise<ProductDetail>;
  getProducts(): Promise<ProductAdminTableRow[]>;
  updateProduct(id: number, input: Partial<ProductInput>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}

export class ProductRepository implements IProductRepository {
  async createProduct(input: ProductInput): Promise<Product> {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el producto principal
      const product = await tx.product.create({
        data: {
          name: input.name,
          description: input.description,
          basePrice: input.basePrice,
          active: input.active,
        },
      });

      // 2. Insertar imágenes (si existen)
      if (input.images && input.images.length > 0) {
        await tx.productImage.createMany({
          data: input.images.map((img) => ({
            productId: product.id,
            url: img.url,
          })),
        });
      }

      // 3. Insertar categorías (si existen)
      if (input.categories && input.categories.length > 0) {
        await tx.productCategory.createMany({
          data: input.categories.map((cat) => ({
            productId: product.id,
            categoryId: cat.categoryId,
          })),
        });
      }

      // 4. Insertar variantes (si existen)
      if (input.variants && input.variants.length > 0) {
        await tx.productVariant.createMany({
          data: input.variants.map((variant) => ({
            productId: product.id,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
          })),
        });
      }
      return product;
    });
  }

  async getProductById(id: number): Promise<ProductDetail> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ProductImage: true,
        ProductCategory: {
          include: { category: true },
        },
        ProductVariant: true,
      },
    });
    if (!product) throw new Error("Producto no encontrado");
    const images: ImageItem[] = product.ProductImage.map((img) => ({
      id: img.id,
      url: img.url,
    }));
    const categories: CategoryItem[] = product.ProductCategory.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
      description: pc.category.description,
    }));
    const variants: VariantItem[] = product.ProductVariant.map((v) => ({
      id: v.id,
      size: v.size,
      price: v.price,
      stock: v.stock,
    }));
    return { product, images, categories, variants };
  }

  async getProducts(): Promise<ProductAdminTableRow[]> {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        ProductCategory: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return products.map((prod) => {
      const categoryNames = prod.ProductCategory.map(
        (pc) => pc.category.name
      ).join(", ");
      return {
        id: prod.id,
        name: prod.name,
        basePrice: prod.basePrice,
        active: prod.active,
        categories: categoryNames,
        createdAt: prod.createdAt,
      };
    });
  }

  async updateProduct(
    id: number,
    input: Partial<ProductInput>
  ): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        basePrice: input.basePrice,
        active: input.active,
      },
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
