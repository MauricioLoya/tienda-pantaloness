import Loader from '@/lib/components/Loader';
import CategoryList from '@/modules/category/components/CategoryList';
import CreateCategory from '@/modules/category/components/CreateCategory';
import { RegionItem, RegionRepository } from '@/modules/region/definitions';
import React, { Suspense } from 'react';

const CategoryPage: React.FC = async () => {
  const regions: RegionItem[] = await new RegionRepository().getAll();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className='flex items-center justify-end border-b pb-2 mb-4'>
          <CreateCategory regions={regions} />
        </div>
        <CategoryList />
      </Suspense>
    </>
  );
};

export default CategoryPage;
