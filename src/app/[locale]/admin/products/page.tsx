import Loader from '@/lib/components/Loader';
import ProductList from '@/modules/catalogue/components/ProductList';
import React, { Suspense } from 'react';
import Link from 'next/link';

const CatalogoPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className='flex items-center justify-end border-b pb-2 mb-4'>
          <Link href='products/new' className='btn btn-primary'>
            Agregar
          </Link>
        </div>
        <ProductList />
      </Suspense>
    </>
  );
};

export default CatalogoPage;
