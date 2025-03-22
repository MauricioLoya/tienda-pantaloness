"use server";

import { SectionInput, SectionRepository } from "../definitions";

export async function createSectionAction(data: SectionInput) {
  return new SectionRepository().createSection(data);
}
