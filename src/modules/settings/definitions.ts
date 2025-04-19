/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prima/client';
import { RegionItem } from '../region/definitions';
export type SettingKey =
  | 'storeName'
  | 'logoUrl'
  | `freeShipping_${string}`
  | `shippingFree_${string}`;

export interface SettingsFormValues {
  storeName: string;
  logoUrl: string;
  freeShippingByRegion: RegionFreeShipping[];
}

export interface RegionFreeShipping {
  regionCode: string;
  amount: number;
  regularShippingPrice: number;
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
    // 1. Get settings from the Settings table
    const allSettings = await this.getAll();
    const storeName = allSettings['storeName'] || '';
    const logoUrl = allSettings['logoUrl'] || '';

    // 2. Get shipping information from the Region table
    const regionData = await prisma.region.findMany({
      where: {
        code: {
          in: regions.map(region => region.code),
        },
      },
      select: {
        code: true,
        shippingPrice: true,
        amountForFreeShipping: true,
        isFreeShipping: true,
      },
    });

    // 3. Map region data to the expected structure
    const freeShippingByRegion = regions.map(region => {
      // Find corresponding region data
      const regionInfo = regionData.find(r => r.code === region.code);

      return {
        regionCode: region.code,
        amount: regionInfo?.amountForFreeShipping ?? 0,
        regularShippingPrice: regionInfo?.shippingPrice ?? 0,
        enabled: regionInfo?.isFreeShipping ?? false,
      };
    });
    console.log('freeShippingByRegion', freeShippingByRegion);
    return {
      storeName,
      logoUrl,
      freeShippingByRegion,
    };
  }

  async saveAllSettings(values: SettingsFormValues) {
    try {
      console.log('saveAllSettings', values);
      const settingsOps = [
        prisma.setting.upsert({
          where: { key: 'storeName' },
          create: { key: 'storeName', value: values.storeName },
          update: { value: values.storeName },
        }),
        prisma.setting.upsert({
          where: { key: 'logoUrl' },
          create: { key: 'logoUrl', value: values.logoUrl },
          update: { value: values.logoUrl },
        }),
      ];

      const regionOps = values.freeShippingByRegion.map(region => {
        return prisma.region.update({
          where: { code: region.regionCode },
          data: {
            amountForFreeShipping: region.amount,
            shippingPrice: region.regularShippingPrice,
            isFreeShipping: region.enabled,
          },
        });
      });

      await prisma.$transaction([...settingsOps, ...regionOps]);

      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  }
}
