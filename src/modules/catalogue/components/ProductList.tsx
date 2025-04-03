import React from 'react';
import { ProductRepository } from '../definitions';
import ProductTable from './ProductTable';
import { RegionRepository } from '@/modules/region/definitions';

const ProductList: React.FC = async () => {
  const promotionRepo = new ProductRepository();
  const products = await promotionRepo.getProducts();
  const regions = await new RegionRepository().getAll();

  return (
    <div className='p-4'>
      <ProductTable values={products} regions={regions} />
    </div>
  );
};

export default ProductList;
