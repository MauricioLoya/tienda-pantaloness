'use server';

import { validateAdminPermission } from '@/lib/auth-validation';
import { SectionRepository } from '../definitions';

export async function deleteSectionAction(id: number) {
  await validateAdminPermission('delete', 'Section');
  return new SectionRepository().deleteSection(id);
}
