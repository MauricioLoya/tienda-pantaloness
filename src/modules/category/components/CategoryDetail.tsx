"use client";

import React, { useState } from "react";
import { CategoryItem } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";
import { ProductAdminTableRow } from "@/modules/catalogue/definitions";
import Link from "next/link";
import { removeProductFromCategoryAction } from "../action/removeProductFromCategoryAction";
import { useToast } from '@/lib/components/ToastContext';

interface CategoryDetailProps {
  category: CategoryItem;
  region: RegionItem | null;
  products?: (ProductAdminTableRow & { imageUrl?: string })[];
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ category, region, products = [] }) => {
  const [relatedProducts, setRelatedProducts] = useState(products);
  const { showToast } = useToast();

  const handleRemoveProduct = async (productId: number) => {
    try {
      await removeProductFromCategoryAction(category.id, productId);
      setRelatedProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );
      showToast("Producto eliminado correctamente", "success");
    } catch (error) {
      showToast("Error al eliminar el producto de la categoría", "success");
    }
  };

  return (
    <div className="card shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
      <p className="mb-2"><strong>Descripción:</strong> {category.description}</p>
      {region && (
        <p className="mb-2">
          <strong>Región:</strong> {region.name} {region.flag}
        </p>
      )}
      <p className="mb-2">
        <strong>Estatus:</strong> {category.isDeleted ? 'Eliminada' : 'Activa'}
      </p>

      <div className="flex items-center justify-between mt-6 mb-4">
        <h3 className="text-xl font-semibold">Productos relacionados</h3>
      </div>

      {relatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="object-cover h-40 w-full"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.slug}</p>
                <div className="card-actions justify-end">
                  <Link href={`/admin/catalogo/${product.id}`} className="btn btn-sm btn-info">
                    Ver detalles
                  </Link>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="btn btn-sm btn-error"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay productos relacionados con esta categoría.</p>
      )}
    </div>
  );
};

export default CategoryDetail;