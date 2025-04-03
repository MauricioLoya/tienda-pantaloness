import React from 'react';
import { PromotionRepository } from '../definitions';
import PromotionTable from './PromotionTable';
import { RegionRepository } from '@/modules/region/definitions';

const PromotionList: React.FC = async () => {
  const promotionRepo = new PromotionRepository();
  const promotions = await promotionRepo.getAll();
  const regions = await new RegionRepository().getAll();

  return (
    <div className='p-4'>
      <PromotionTable values={promotions} regions={regions} />
    </div>
  );
};

export default PromotionList;
