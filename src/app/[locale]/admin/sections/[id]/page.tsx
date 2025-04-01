import React from "react";
import HeaderContent from "@/lib/components/HeaderContent";
import { RegionRepository } from "@/modules/region/definitions";
import SectionDetails from "@/modules/section/components/SectionDetails";
import { SectionRepository } from "@/modules/section/definitions";
import UpdateSection from "@/modules/section/components/UpdateSection";
import { ProductRepository } from "@/modules/catalogue/definitions";

type Props = {
  params: Promise<{ id: string }>;
};

const SectionDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  const section = await new SectionRepository().getById(Number(id));
  const availableProducts = await new ProductRepository().getAvailableProducts();
  const usedOrders = await new SectionRepository().getUsedOrders()
  if (!section) {
    return <div>Sección no encontrada</div>;
  }
  const region = await new RegionRepository().getById(section.regionId);
  const regions = await new RegionRepository().getAll();

  const actions = (
    <>
      <UpdateSection
        availableProducts={availableProducts}
        section={section}
        regions={regions}
        usedOrders={usedOrders}
      />
    </>
  );

  return (
    <>
      <HeaderContent
        title={`Detalle de ${section.title}`}
        href="./"
        action={actions}
      />
      <SectionDetails section={section} region={region ?? undefined} />
    </>
  );
};

export default SectionDetailsPage;