'use server';

import { SectionRepository } from "../definitions";



export async function deleteSectionAction(id: number) {
  return new SectionRepository().deleteSection(id);
}