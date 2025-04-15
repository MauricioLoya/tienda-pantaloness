import React, { Suspense } from 'react';
import HeroSection from '@/modules/category-list/components/HeroSection';
import CategoryList from '@/modules/category-list/components/CategoryList';
import CategoryListSkeleton from '@/modules/category-list/components/CategoryListSkeleton';

async function CategoriesPage() {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  );
}

export default CategoriesPage;
