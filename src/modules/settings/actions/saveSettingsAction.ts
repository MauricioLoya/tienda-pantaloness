'use server';

import { SettingsFormValues } from '../definitions';
import { SettingsRepository } from '../definitions';

export async function saveSettingsAction(values: SettingsFormValues) {
  const repo = new SettingsRepository();

  const updates = [
    { key: 'storeName', value: values.storeName },
    { key: 'logoUrl', value: values.logoUrl },
    ...values.freeShippingByRegion.map(item => ({
      key: `freeShipping_${item.regionCode}`,
      value: {
        amount: item.amount,
        enabled: item.enabled,
      },
    })),
  ];

  await repo.updateMany(updates);
}
