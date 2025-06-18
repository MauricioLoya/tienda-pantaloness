'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { SectionInput, SectionRepository } from '../definitions';

export async function createSectionAction(data: SectionInput) {
  await validateAdminPermission('create', 'Section');
  return new SectionRepository().createSection(data);
}
