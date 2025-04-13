import Loader from '@/lib/components/Loader';
import React, { Suspense } from 'react';
import { RegionRepository } from '@/modules/region/definitions';
import SectionList from '@/modules/section/components/SectionList';
import CreateSection from '@/modules/section/components/CreateSection';
import { ProductRepository } from '@/modules/catalogue/definitions';
import { SectionRepository } from '@/modules/section/definitions';

const SectionPage: React.FC = async () => {
  const regions = await new RegionRepository().getAll();
  const usedOrders = await new SectionRepository().getUsedOrdersByRegion();

  const availableProducts = await new ProductRepository().getAvailableProducts();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className='flex items-center justify-end border-b pb-2 mb-4'>
          <CreateSection
            regions={regions}
            availableProducts={availableProducts}
            usedOrders={usedOrders}
          />
        </div>
        <SectionList />
      </Suspense>
    </>
  );
};

export default SectionPage;
