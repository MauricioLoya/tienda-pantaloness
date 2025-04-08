import Loader from '@/lib/components/Loader';
import { RegionRepository } from '@/modules/region/definitions';
import StoreSettings from '@/modules/settings/components/StoreSettings';
import { SettingsRepository } from '@/modules/settings/definitions';
import React, { Suspense } from 'react';

const SettingsPage: React.FC = async () => {
  const regions = await new RegionRepository().getAll();
  const initialValues = await new SettingsRepository().getSettingsInitialValues(regions);
  return (
    <>
      <Suspense fallback={<Loader />}>
        <StoreSettings initialValues={initialValues} regions={regions} />
      </Suspense>
    </>
  );
};

export default SettingsPage;
