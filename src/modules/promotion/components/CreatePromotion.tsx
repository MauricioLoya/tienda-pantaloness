'use client';
import { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import PromotionForm from './PromotionForm';
import { useRouter } from 'next/navigation';
import { RegionItem } from '@/modules/region/definitions';
import { CreatePromotionAction } from '../actions/createPromotionAction';
import { PromotionInput } from '../definitions';

const CreatePromotion = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();

  const [formState, setFormState] = useState<PromotionInput>({
    code: '',
    name: '',
    description: '',
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
    active: false,
    regionId: '',
  });

  const handleValuesChange = (values: PromotionInput) => {
    setFormState(values);
  };
  const handleSubmit = async (close: () => void) => {
    try {
      await CreatePromotionAction(formState);
      close();
      router.refresh();
    } catch (error: unknown) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <>
      <ModalGeneric
        title='Agregar promoción'
        triggerBtnTitle='Agregar'
        actionBtnText='Guardar'
        actionBtnFunction={handleSubmit}
        cancelBtnText='Cancelar'
        cancelBtnFunction={() => console.log('click action cancel')}
      >
        <PromotionForm
          onValuesChange={handleValuesChange}
          regions={regions}
        />
      </ModalGeneric>
    </>
  );
};

export default CreatePromotion;
