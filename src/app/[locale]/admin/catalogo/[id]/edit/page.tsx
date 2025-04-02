import Loader from '@/lib/components/Loader'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { ProductRepository } from '@/modules/catalogue/definitions'
import { RegionRepository } from '@/modules/region/definitions'
import { CategoryRepository } from '@/modules/category/definitions'
import ImagesForm from '@/modules/catalogue/components/ImagesForm'
import BasicForm from '@/modules/catalogue/components/BasicForm'
import CategoriesForm from '@/modules/catalogue/components/CategoriesForm'
import VariantsForm from '@/modules/catalogue/components/VariantsForm'
import HeaderContent from '@/lib/components/HeaderContent'

type Props = {
  params: { id: string }
}

const UpdateCatalogoPage = async ({ params }: Props) => {
  const { id } = await params
  const productId = Number(id)
  const productRepo = new ProductRepository()
  const productDetail = await productRepo.getProductById(productId)
  const basicData = {
    name: productDetail.product.name,
    description: productDetail.product.description,
    active: productDetail.product.active,
    regionId: productDetail.product.regionId ?? undefined,
    slug: productDetail.product.slug ?? undefined
  }
  return (
    <>
      <Suspense fallback={<Loader />}>
        <HeaderContent
          title={`Editar ${productDetail.product.name}`}
          href="./"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BasicForm
            initialData={basicData}
            productId={productId}
            regions={await new RegionRepository().getAll()}
          />

          <ImagesForm productId={productId} images={productDetail.images} />
          <CategoriesForm
            productId={productId}
            categories={productDetail.categories}
            allCategories={await new CategoryRepository().getAll()}
          />

          <VariantsForm
            productId={productId}
            variants={productDetail.variants}
          />
        </div>
      </Suspense>
    </>
  )
}

export default UpdateCatalogoPage
