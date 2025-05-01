import Loader from '@/lib/components/Loader';
import { RegionRepository } from '@/modules/region/definitions';
import StoreSettingsForm from '@/modules/settings/components/StoreSettingsForm';
import { SettingsRepository } from '@/modules/settings/definitions';
import React, { Suspense } from 'react';

const SettingsPage: React.FC = async () => {
  const regions = await new RegionRepository().getAll();
  const initialValues = await new SettingsRepository().getSettingsInitialValues(regions);


  return (
    <>
      <Suspense fallback={<Loader />}>
        <StoreSettingsForm initialValues={
          {
            logoUrl: initialValues.logoUrl,
            storeName: initialValues.storeName,
            freeShippingByRegion: initialValues.freeShippingByRegion,
            contactInfo: initialValues.contactInfo,
          }
        } regions={regions} />
      </Suspense>
    </>
  );
};

export default SettingsPage;
