import React from 'react';
import BasicForm from '@/modules/catalogue/components/BasicForm';
import ImagesForm from '@/modules/catalogue/components/ImagesForm';
import CategoriesForm from '@/modules/catalogue/components/CategoriesForm';
import VariantsForm from '@/modules/catalogue/components/VariantsForm';
import HeaderContent from '@/lib/components/HeaderContent';
import { CategoryRepository } from '@/modules/category/definitions';
import { RegionItem, RegionRepository } from '@/modules/region/definitions';
import TagsForm from '@/modules/catalogue/components/TagsForm';

const CreateProductPage: React.FC = async () => {
  const regions: RegionItem[] = await new RegionRepository().getAll();
  return (
    <>
      <HeaderContent title='Crear Producto' href='./' />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <BasicForm regions={regions} />
        <ImagesForm />
        <CategoriesForm allCategories={await new CategoryRepository().getAll()} />

        <VariantsForm />
      </div>
      <TagsForm />

      <VariantsForm />
    </>
  );
};

export default CreateProductPage;
