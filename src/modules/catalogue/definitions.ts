import { prisma } from "@/lib/prima/client";
import { generateSlug } from "@/lib/utils";
import { Product } from "@prisma/client";
import { CategoryItem } from "../category/definitions";

export interface ProductInput {
  name: string;
  description: string;
  basePrice: number;
  active: boolean;
  regionId: string;
  slug: string
}

export type ImageItem = {
  id: number;
  url: string;
};

export type VariantItem = {
  id: number;
  size: string;
  price: number;
  stock: number;
  discount?: number;
  discountPrice?: number | null;
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
  slug: string;
  regionId: string;
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
        slug: prod.slug ?? "",
        regionId: prod.regionId ?? "",
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
      discount: v.discount,
      discountPrice: v.discountPrice,
    }));
    return { product, images, categories, variants };
  }

  async createBasic(data: ProductInput): Promise<Product> {
    const slug = generateSlug(data.name);
    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        active: data.active,
        regionId: data.regionId,
      },
    });
  }

  async updateBasic(id: number, data: Partial<ProductInput>): Promise<Product> {
    const slug = generateSlug(data.name ?? "");
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        active: data.active,
        regionId: data.regionId,
      },
    });
  }

  async addImage(productId: number, url: string) {
    return prisma.productImage.create({
      data: { productId, url },
    });
  }

  async removeImage(imageId: number) {
    return prisma.productImage.delete({ where: { id: imageId } });
  }

  async addCategory(productId: number, categoryId: number) {
    return prisma.productCategory.create({
      data: { productId, categoryId },
    });
  }

  async removeCategory(productId: number, categoryId: number) {
    return prisma.productCategory.deleteMany({
      where: { productId, categoryId },
    });
  }

  async addVariant(
    productId: number,
    size: string,
    price: number,
    stock: number,
    discount?: number
  ) {
    const exist = await prisma.productVariant.findFirst({
      where: { productId, size },
    });

    if (exist) throw new Error("Ya existe una variante con ese tamaño");
    const discountVal = discount ?? 0;
    const discountPrice = price * (1 - discountVal / 100);
    return prisma.productVariant.create({
      data: {
        productId,
        size,
        price,
        stock,
        discount: discountVal,
        discountPrice: Math.round(discountPrice * 100) / 100,
      },
    });
  }

  async removeVariant(variantId: number) {
    return prisma.productVariant.delete({ where: { id: variantId } });
  }

  async getProductsForCategory(categoryId: number): Promise<ProductAdminTableRow[]> {
    const products = await prisma.product.findMany({
      where: {
        ProductCategory: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        ProductCategory: { include: { category: true } },
        ProductImage: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return products.map((prod) => {
      const categoryNames = prod.ProductCategory.map((pc) => pc.category.name).join(", ");
      return {
        id: prod.id,
        name: prod.name,
        basePrice: prod.basePrice,
        active: prod.active,
        slug: prod.slug ?? "",
        regionId: prod.regionId ?? "",
        categories: categoryNames,
        createdAt: prod.createdAt,
        imageUrl: prod.ProductImage[0]?.url,
      };
    });
  }
}
