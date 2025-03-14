import { prisma } from "@/lib/prima/client";
import { Product } from "@prisma/client";

export interface ProductInput {
  name: string;
  description: string;
  basePrice: number;
  active: boolean;
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

export class ProductRepository {

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
  async getProductById(id: number): Promise<ProductDetail> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ProductImage: true,
        ProductCategory: { include: { category: true } },
        ProductVariant: true
      }
    })
    if (!product) throw new Error("Producto no encontrado")

    const images: ImageItem[] = product.ProductImage.map(img => ({
      id: img.id,
      url: img.url
    }))
    const categories: CategoryItem[] = product.ProductCategory.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      description: pc.category.description
    }))
    const variants: VariantItem[] = product.ProductVariant.map(v => ({
      id: v.id,
      size: v.size,
      price: v.price,
      stock: v.stock
    }))

    return { product, images, categories, variants }
  }

  async createBasic(data: ProductInput): Promise<Product> {
    return prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        active: data.active
      }
    })
  }
  async updateBasic(id: number, data: ProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        active: data.active
      }
    })
  }

  async addImage(productId: number, url: string) {
    return prisma.productImage.create({
      data: { productId, url }
    })
  }

  async removeImage(imageId: number) {
    return prisma.productImage.delete({ where: { id: imageId } })
  }

  async addCategory(productId: number, categoryId: number) {
    return prisma.productCategory.create({
      data: { productId, categoryId }
    })
  }

  async removeCategory(productId: number, categoryId: number) {
    return prisma.productCategory.deleteMany({
      where: { productId, categoryId }
    })
  }

  async addVariant(productId: number, size: string, price: number, stock: number) {
    const exist = await prisma.productVariant.findFirst({
      where: { productId, size }
    })
    if (exist) throw new Error("Ya existe una variante con ese tamaño")

    return prisma.productVariant.create({
      data: { productId, size, price, stock }
    })
  }

  async removeVariant(variantId: number) {
    return prisma.productVariant.delete({ where: { id: variantId } })
  }
}
