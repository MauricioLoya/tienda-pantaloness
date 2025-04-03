import { prisma } from '@/lib/prima/client';
import { Section, SectionType } from '@prisma/client';

export interface HighlightProductItem {
  id: number;
  name: string;
  imageUrl?: string;
  slug: string;
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
    console.log(data);
    const section = await prisma.section.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        regionId: data.regionId,
        actionUrl: data.actionUrl,
        order: data.order,
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
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        HighlightProduct: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });
    if (!section) {
      return null;
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
        })) || [],
    };
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
    await prisma.section.delete({ where: { id } });
  }

  async getSectionsByRegion(regionCode: string): Promise<SectionItem[]> {
    const sections = await prisma.section.findMany({
      where: { regionCode },
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
    const section = await prisma.section.findUniqueOrThrow({
      where: { id: sectionId },
      include: {
        HighlightProduct: {
          include: {
            product: {
              include: {
                ProductImage: true,
              },
            },
          },
        },
      },
    });

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
        })) || [],
    };
  }
  async getUsedOrders(): Promise<number[]> {
    const sections = await prisma.section.findMany({
      select: {
        order: true,
      },
    });
    return sections.map(section => section.order);
  }
}
