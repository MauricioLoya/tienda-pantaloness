import { prisma } from '@/lib/prima/client';
import { SectionType } from '@prisma/client';

export interface UsedOrdersByRegion {
  [regionCode: string]: number[];
}
export interface HighlightProductItem {
  id: number;
  name: string;
  imageUrl?: string;
  slug: string;
  isAvailable: boolean;
  basePrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  description: string;
}

export interface SectionInput {
  type: SectionType;
  title: string;
  description: string;
  regionId: string;
  actionUrl: string;
  order: number;
  backgroundUrl: string;
  backgroundColor: string;
  buttonText?: string;
  buttonColor?: string;
  highlightProducts?: HighlightProductItem[];
}

export interface SectionItem {
  id: number;
  type: SectionType;
  title: string;
  description: string;
  regionId: string;
  actionUrl: string;
  order: number;
  backgroundUrl: string;
  backgroundColor: string;
  buttonText: string;
  buttonColor: string;
  highlightProducts: HighlightProductItem[];
}

export class SectionRepository {
  async createSection(data: SectionInput): Promise<SectionItem> {
    const section = await prisma.section.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        regionId: data.regionId,
        actionUrl: data.actionUrl,
        order: data.order,
        buttonText: data.buttonText,
        buttonColor: data.buttonColor,
        backgroundUrl: data.backgroundUrl,
        backgroundColor: data.backgroundColor,
      },
    });

    if (data.type === SectionType.highlight && data.highlightProducts) {
      await Promise.all(
        data.highlightProducts.map(product =>
          prisma.highlightProduct.create({
            data: {
              productId: product.id,
              sectionId: section.id,
            },
          })
        )
      );
    }

    return this.toSectionItem(section.id);
  }

  async getById(id: number): Promise<SectionItem | null> {
    try {
      return await this.toSectionItem(id);
    } catch (error) {
      console.error(`Error fetching section with ID ${id}:`, error);
      return null;
    }
  }

  async updateSection(id: number, data: Partial<SectionInput>): Promise<SectionItem> {
    await prisma.section.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        regionId: data.regionId ? data.regionId : undefined,
        actionUrl: data.actionUrl,
        order: data.order,
        backgroundUrl: data.backgroundUrl,
        backgroundColor: data.backgroundColor,
        buttonColor: data.buttonColor,
        buttonText: data.buttonText,
      },
    });

    if (data.type === SectionType.highlight && data.highlightProducts) {
      await prisma.highlightProduct.deleteMany({
        where: { sectionId: id },
      });
      await Promise.all(
        data.highlightProducts.map(product =>
          prisma.highlightProduct.create({
            data: { productId: product.id, sectionId: id },
          })
        )
      );
    }

    return this.toSectionItem(id);
  }

  async deleteSection(id: number): Promise<void> {
    await prisma.highlightProduct.deleteMany({
      where: { sectionId: id },
    });
    await prisma.section.delete({ where: { id } });
  }

  async getAllByRegion(regionCode: string): Promise<SectionItem[]> {
    const sections = await prisma.section.findMany({
      where: { regionId: regionCode },
      orderBy: { order: 'asc' },
    });
    const items: SectionItem[] = [];
    for (const sec of sections) {
      items.push(await this.toSectionItem(sec.id));
    }
    return items;
  }

  async getAll(): Promise<SectionItem[]> {
    const sections = await prisma.section.findMany({
      orderBy: { order: 'asc' },
    });

    const items: SectionItem[] = [];
    for (const sec of sections) {
      items.push(await this.toSectionItem(sec.id));
    }
    return items;
  }

  private async toSectionItem(sectionId: number): Promise<SectionItem> {
    const section = await prisma.section.findFirst({
      where: { id: sectionId },
      include: {
        HighlightProduct: {
          include: {
            product: {
              include: {
                ProductImage: true,
                ProductVariant: true,
              },
            },
          },
        },
      },
    });
    if (!section) {
      throw new Error(`Section with ID ${sectionId} not found`);
    }
    return {
      id: section.id,
      type: section.type,
      title: section.title,
      description: section.description,
      regionId: section.regionId,
      actionUrl: section.actionUrl,
      order: section.order,
      backgroundUrl: section.backgroundUrl,
      backgroundColor: section.backgroundColor,
      buttonText: section.buttonText ?? '',
      buttonColor: section.buttonColor ?? '',
      highlightProducts:
        section.HighlightProduct.map(hp => ({
          id: hp.product.id,
          name: hp.product.name,
          slug: hp.product.slug ?? '',
          imageUrl: hp.product.ProductImage[0]?.url ?? '/placeholder.jpg',
          isAvailable: hp.product.active,
          basePrice: hp.product.ProductVariant[0]?.price ?? 0,
          discountedPrice: hp.product.ProductVariant[0]?.discountPrice ?? 0,
          discountPercentage: hp.product.ProductVariant[0]?.discount ?? 0,
          description: hp.product.description,
        })) || [],
    };
  }
  async getUsedOrdersByRegion(excludeSectionId?: number): Promise<UsedOrdersByRegion> {
    const sections = await prisma.section.findMany({
      select: {
        id: true,
        regionId: true,
        order: true,
      },
    });
    const usedOrdersByRegion: UsedOrdersByRegion = {};
    sections.forEach(section => {
      if (excludeSectionId && section.id === excludeSectionId) {
        return;
      }
      if (section.regionId) {
        if (!usedOrdersByRegion[section.regionId]) {
          usedOrdersByRegion[section.regionId] = [];
        }
        usedOrdersByRegion[section.regionId].push(section.order);
      }
    });
    return usedOrdersByRegion;
  }
}
