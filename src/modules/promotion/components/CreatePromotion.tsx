'use client';

import ModalGeneric from '@/lib/components/ModalGeneric';
import PromotionForm from './PromotionForm';
import { useRouter } from 'next/navigation';
import { RegionItem } from '@/modules/region/definitions';
import { CreatePromotionAction } from '../actions/createPromotionAction';


const CreatePromotion = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();





  return (
    <>
      <ModalGeneric
        title='Agregar promoción'
        triggerBtnTitle='Agregar'
      >
        <PromotionForm
          onSuccess={async (values) => {
            await CreatePromotionAction(values);
            router.refresh();
          }}
          regions={regions}
        />
      </ModalGeneric>
    </>
  );
};

export default CreatePromotion;
