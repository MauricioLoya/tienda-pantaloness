// src/modules/landing/definitions.ts
import { prisma } from "@/lib/prima/client";
import { Section, SectionType } from "@prisma/client";

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
  highlightProductIds?: number[];
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

    if (data.type === SectionType.highlight && data.highlightProductIds) {
      await Promise.all(
        data.highlightProductIds.map((productId) =>
          prisma.highlightProduct.create({
            data: {
              productId,
              sectionId: section.id,
            },
          })
        )
      );
    }

    return this.toSectionItem(section.id);
  }

  async updateSection(
    id: number,
    data: Partial<SectionInput>
  ): Promise<SectionItem> {
    await prisma.section.update({
      where: { id },
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        regionCode: data.regionCode ? data.regionCode : undefined,
        actionUrl: data.actionUrl,
        order: data.order,
        backgroundUrl: data.backgroundUrl,
        backgroundColor: data.backgroundColor,
      },
    });

    if (data.type === SectionType.highlight && data.highlightProductIds) {
      await prisma.highlightProduct.deleteMany({
        where: { sectionId: id },
      });
      await Promise.all(
        data.highlightProductIds.map((productId) =>
          prisma.highlightProduct.create({
            data: { productId, sectionId: id },
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
      orderBy: { order: "asc" },
    });
    const items: SectionItem[] = [];
    for (const sec of sections) {
      items.push(await this.toSectionItem(sec.id));
    }
    return items;
  }
  async getAll(): Promise<SectionItem[]> {
    const sections = await prisma.section.findMany({
      orderBy: { order: "asc" },
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
            product: true,
          },
        },
      },
    });

    return {
      id: section.id,
      type: section.type,
      title: section.title,
      description: section.description,
      regionCode: section.regionCode ? section.regionCode : undefined,
      actionUrl: section.actionUrl,
      order: section.order,
      backgroundUrl: section.backgroundUrl,
      backgroundColor: section.backgroundColor,
      highlightProducts:
        section.HighlightProduct.map((hp) => ({
          id: hp.product.id,
          name: hp.product.name,
          slug: hp.product.slug ?? "",
          imageUrl: "/placeholder.jpg", // Puedes mapear la imagen real si está disponible
        })) || [],
    };
  }
}