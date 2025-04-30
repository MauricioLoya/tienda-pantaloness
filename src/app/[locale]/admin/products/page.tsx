import Loader from '@/lib/components/Loader';
import ProductList from '@/modules/catalogue/components/ProductList';
import React, { Suspense } from 'react';
import { AddEntity } from '@/lib/components/ButtonComponents';

const CatalogoPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className='flex items-center justify-end border-b pb-2 mb-4'>
          <AddEntity href='products/new' size='primary' />
        </div>
        <ProductList />
      </Suspense>
    </>
  );
};

export default CatalogoPage;
