import React from 'react';
import { ProductListRepository } from '../definitions';
import { notFound } from 'next/navigation';
import ProductImageGallery from './ProductImageGallery';
import ProductVariantSelector from './ProductVariantSelector';

interface Props {
  slug: string;
  selectedSize?: string;
}

// This component will be rendered when the data is available
const ProductDetails = async ({ slug, selectedSize }: Props) => {
  const productRepository = new ProductListRepository();

  try {
    const productDetail = await productRepository.productDetail(slug);
    console.log('Product Detail:', productDetail);
    if (!productDetail) {
      notFound();
    }

    // Sample product images - replace with actual images from your API
    const productImages = productDetail.images;

    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left side - Image Gallery */}
          <ProductImageGallery
            images={productImages}
            productName={productDetail.product.name}
            bestSeller={true}
          />

          {/* Right side - Product Details */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold mb-4'>{productDetail.product.name}</h1>
              <p className='text-gray-600 mt-4'>{productDetail.product.description}</p>
            </div>

            <ProductVariantSelector
              productSlug={productDetail.product.slug ?? ''}
              productImage={productImages[0]}
              productName={productDetail.product.name}
              variants={productDetail.variants}
              selectedSize={selectedSize}
              productId={productDetail.product.id}
              productRegionId={productDetail.product.regionId || ' NO has regionId'}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return notFound();
  }
};

export default ProductDetails;
