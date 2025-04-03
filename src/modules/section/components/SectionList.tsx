import React from 'react';
import { RegionRepository } from '@/modules/region/definitions';
import SectionTable from './SectionTable';
import { SectionRepository } from '../definitions';
const SectionList: React.FC = async () => {
  const sections = await new SectionRepository().getAll();
  const regions = await new RegionRepository().getAll();

  return <SectionTable values={sections} regions={regions} />;
};

export default SectionList;
