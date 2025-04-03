'use server';

import { SectionInput, SectionRepository } from '../definitions';

export async function updateSectionAction(id: number, data: SectionInput) {
  return new SectionRepository().updateSection(id, data);
}
