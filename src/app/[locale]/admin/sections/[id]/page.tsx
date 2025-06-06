import React from 'react';
import HeaderContent from '@/lib/components/HeaderContent';
import { RegionRepository } from '@/modules/region/definitions';
import SectionDetails from '@/modules/section/components/SectionDetails';
import { SectionRepository } from '@/modules/section/definitions';
import UpdateSection from '@/modules/section/components/UpdateSection';
import { ProductRepository } from '@/modules/catalogue/definitions';
import DeleteSection from '@/modules/section/components/DeleteSection';
import { numericRouteGuard } from '@/lib/utils';
type Props = {
  params: Promise<{ id: string }>;
};

const SectionDetailsPage: React.FC<Props> = async ({ params }) => {
  const id = numericRouteGuard((await params).id);

  const section = await new SectionRepository().getById(Number(id));
  if (!section) {
    return <div>Sección no encontrada</div>;
  }
  const availableProducts = await new ProductRepository().getAvailableProducts(section.regionId);
  const usedOrders = await new SectionRepository().getUsedOrdersByRegion(section.id);
  const region = await new RegionRepository().getById(section.regionId);
  const regions = await new RegionRepository().getAll();

  const actions = (
    <>
      <UpdateSection
        availableProducts={availableProducts}
        section={section}
        regions={regions}
        usedOrdersByRegion={usedOrders}
      />
      <DeleteSection section={section} />
    </>
  );

  return (
    <>
      <HeaderContent title={`Detalle de ${section.title}`} href='./' action={actions} />
      <SectionDetails section={section} region={region ?? undefined} />
    </>
  );
};

export default SectionDetailsPage;
