'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { SectionInput, SectionRepository } from '../definitions';

export async function updateSectionAction(id: number, data: SectionInput) {
  await validateAdminPermission('update', 'Section');
  return new SectionRepository().updateSection(id, data);
}
