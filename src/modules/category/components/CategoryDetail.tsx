'use client';

import React, { useState } from 'react';
import { CategoryItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { ProductAdminTableRow } from '@/modules/catalogue/definitions';
import Link from 'next/link';
import { removeProductFromCategoryAction } from '../action/removeProductFromCategoryAction';

interface CategoryDetailProps {
  category: CategoryItem;
  region: RegionItem | null;
  products?: ProductAdminTableRow[];
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, region, products }) => {
  const [relatedProducts, setRelatedProducts] = useState(products);

  const handleRemoveProduct = async (productId: number) => {
    try {
      await removeProductFromCategoryAction(category.id, productId);
      setRelatedProducts((prev) => (prev || []).filter((product) => product.id !== productId));
    } catch (error) {
      alert('Error al eliminar el producto de la categoría.');
    }
  };

  return (
    <div className="card shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {category.description}</p>
      {region && (
        <p className="mb-2"><strong>Región:</strong> {region.name} {region.flag}</p>
      )}
      <p className="mb-2">
        <strong>Estatus:</strong> {category.isDeleted ? 'Eliminada' : 'Activa'}
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-4">Productos relacionados</h3>
      {relatedProducts && relatedProducts.length > 0 ? (
        <ul className="list-disc pl-6">
          {relatedProducts.map((product) => (
            <li key={product.id} className="mb-2">
              <span className="font-medium">{product.name}</span>
              <div className="flex gap-2 mt-2">
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Ver detalles
                </Link>
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="btn btn-sm btn-error"
                >
                  Eliminar de la categoría
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay productos relacionados con esta categoría.</p>
      )}
    </div>
  );
};

export default CategoryDetail;