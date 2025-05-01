'use server';

import { SettingsFormValues } from '../definitions';
import { SettingsRepository } from '../definitions';

export async function saveSettingsAction(values: SettingsFormValues) {
  try {
    const settingsRepo = new SettingsRepository();

    await settingsRepo.saveAllSettings({
      ...values,
      contactInfo: {
        ...values.contactInfo,
        businessHours: values.contactInfo.businessHours,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings');
  }
}
