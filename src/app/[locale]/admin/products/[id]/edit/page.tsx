import React, { Suspense } from 'react';
import { ProductRepository } from '@/modules/catalogue/definitions';
import { RegionRepository } from '@/modules/region/definitions';
import { CategoryRepository } from '@/modules/category/definitions';
import ImagesForm from '@/modules/catalogue/components/ImagesForm';
import BasicForm from '@/modules/catalogue/components/BasicForm';
import CategoriesForm from '@/modules/catalogue/components/CategoriesForm';
import HeaderContent from '@/lib/components/HeaderContent';
import TagsForm from '@/modules/catalogue/components/TagsForm';
import VariantsForm from '@/modules/catalogue/components/VariantsForm';
import { numericRouteGuard } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

// Skeleton component for the basic form
const BasicFormSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 m-2 w-full max-w-7xl">
      <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
          </React.Fragment>
        ))}
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );
};

// Skeleton component for the images form
const ImagesFormSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 m-2 w-full">
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="flex flex-wrap gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 w-36 bg-gray-200 rounded"></div>
        ))}
        <div className="h-36 w-36 bg-gray-200 rounded flex items-center justify-center">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton component for the categories form
const CategoriesFormSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 m-2 w-full">
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton component for the tags form
const TagsFormSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 m-2 w-full">
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton component for the variants form
const VariantsFormSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-md p-4 m-2 w-full">
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );
};

// Product edit form container with data fetching
const ProductEditContainer = async ({ id }: { id: string }) => {
  const productId = numericRouteGuard(id);

  const productRepo = new ProductRepository();

  const productDetail = await productRepo.getProductById(Number(productId));
  const regions = await new RegionRepository().getAll();
  console.log('product region:', productDetail.product.regionId);

  const categories = await new CategoryRepository().getAllByRegion(
    productDetail.product.regionId
  );

  const basicData = {
    name: productDetail.product.name,
    description: productDetail.product.description,
    active: productDetail.product.active,
    regionId: productDetail.product.regionId ?? undefined,
    slug: productDetail.product.slug ?? undefined,
  };



  return (
    <>
      <HeaderContent title={`Editar ${productDetail.product.name}`} href='./' />
      <div className='grid gap-4 pb-20'>

        <BasicForm
          initialData={basicData}
          productId={productId}
          regions={regions}
        />

        <ImagesForm productId={productId} images={productDetail.images} />
        <CategoriesForm
          productId={productId}
          categories={productDetail.categories}
          allCategories={categories}
        />
        <TagsForm productId={productId} initialTags={productDetail.product.searchWords} />
        <VariantsForm productId={productId} variants={productDetail.variants} />
      </div>

    </>
  );
};

const UpdateCatalogoPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <Suspense fallback={
      <>
        <HeaderContent title="Cargando producto..." href='./' />
        <div className='flex justify-center mx-auto p-6'>
          <div className='flex flex-initial'>
            <BasicFormSkeleton />
          </div>
          <div className='flex flex-col flex-2'>
            <ImagesFormSkeleton />
            <CategoriesFormSkeleton />
            <TagsFormSkeleton />
            <VariantsFormSkeleton />
          </div>
        </div>
      </>
    }>
      <ProductEditContainer id={id} />
    </Suspense>
  );
};

export default UpdateCatalogoPage;
