import React from 'react';
import { CategoryRepository } from '../definitions';
import CategoryTable from './CategoryTable';
import { RegionRepository } from '@/modules/region/definitions';

const CategoryList: React.FC = async () => {
  const categories = await new CategoryRepository().getAll();
  const regions = await new RegionRepository().getAll();

  return (
    <>
      <CategoryTable values={categories} regions={regions} />
    </>
  );
};

export default CategoryList;
