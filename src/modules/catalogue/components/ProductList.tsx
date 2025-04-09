import React from 'react';
import { ProductRepository } from '../definitions';
import ProductTable from './ProductTable';
import { RegionRepository } from '@/modules/region/definitions';
import { CategoryRepository } from '@/modules/category/definitions';

const ProductList: React.FC = async () => {
  const products = await new ProductRepository().getProducts();
  const regions = await new RegionRepository().getAll();
  const categories = await new CategoryRepository().getAllActive();
  return (
    <div className='p-4'>
      <ProductTable values={products} regions={regions} categories={categories} />
    </div>
  );
};

export default ProductList;
