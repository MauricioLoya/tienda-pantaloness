'use server';

import { SettingsFormValues } from '../definitions';
import { SettingsRepository } from '../definitions';

export async function saveSettingsAction(values: SettingsFormValues) {
  await new SettingsRepository().saveAllSettings(values);
}
