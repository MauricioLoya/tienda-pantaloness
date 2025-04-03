import Loader from '@/lib/components/Loader';
import ListOrders from '@/modules/orders/components/ListOrders';
import React, { Suspense } from 'react';

const OrdenesPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <ListOrders />
      </Suspense>
    </>
  );
};

export default OrdenesPage;
