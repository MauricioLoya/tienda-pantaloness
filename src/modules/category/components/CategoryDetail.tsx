'use client';

import React from 'react';
import { CategoryItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import DeleteButton from '@/lib/components/DeleteButton';

interface CategoryDetailProps {
  category: CategoryItem;
  region: RegionItem | null;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, region }) => {

  return (
    <div className="card shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {category.description}</p>
      {region && (
        <p className="mb-2"><strong>Región:</strong> {region.name} {region.flag}</p>
      )}
      {/* <div className="mt-4">
        <DeleteButton label="Eliminar categoría" onClick={handleDelete} />
      </div> */}
    </div>
  );
};

export default CategoryDetail;
