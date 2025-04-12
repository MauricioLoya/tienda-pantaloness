/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prima/client';
import { RegionItem } from '../region/definitions';
export type SettingKey =
  | 'storeName'
  | 'logoUrl'
  | `freeShipping_${string}`
  | `shippingFree_${string}`;

export type Setting = {
  key: string;
  value: any;
};

export interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  freeShippingByRegion: RegionFreeShippingWithToggle[];
}

export interface RegionFreeShippingWithToggle {
  regionCode: string;
  amount: number;
  enabled: boolean;
}

export class SettingsRepository {
  async getAll(): Promise<Record<string, any>> {
    const settings = await prisma.setting.findMany();
    const mapped: Record<string, any> = {};
    for (const setting of settings) {
      mapped[setting.key] = setting.value;
    }
    return mapped;
  }

  async get(key: string): Promise<any | null> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    return setting?.value ?? null;
  }

  async update(key: string, value: any): Promise<void> {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  async updateMany(settings: { key: string; value: any }[]): Promise<void> {
    const ops = settings.map(({ key, value }) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    );
    await prisma.$transaction(ops);
  }

  async getSettingsInitialValues(regions: RegionItem[]): Promise<SettingsFormValues> {
    const repo = new SettingsRepository();
    const allSettings = await repo.getAll();

    const storeName = allSettings['storeName'] || '';
    const logoUrl = allSettings['logoUrl'] || '';

    const freeShippingByRegion = regions.map(region => {
      const key = `freeShipping_${region.code}`;
      const value = allSettings[key] || { amount: 0, enabled: false };

      return {
        regionCode: region.code,
        amount: value.amount ?? 0,
        enabled: value.enabled ?? false,
      };
    });

    return {
      storeName,
      logoUrl,
      freeShippingByRegion,
    };
  }
}
