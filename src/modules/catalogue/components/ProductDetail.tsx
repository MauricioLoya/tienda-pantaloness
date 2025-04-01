"use client";

import React from "react";
import DisplayInfo from "@/lib/components/DisplayInfo";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";
import GoBack from "@/lib/components/GoBack";
import Link from "next/link";
import { ProductDetail } from "../definitions";
import ImagePreview from "@/lib/components/ImagePreview";

type Props = {
  productProp: ProductDetail;
};

const ProductDetails: React.FC<Props> = ({ productProp }) => {
  const { product, images, categories, variants } = productProp;

  return (
    <div className="container mx-auto p-4">
      {images.length > 0 && (
        <div className="mb-6">
          <ImagePreview
            src={images[0].url}
            alt={product.name}
            containerClassName="w-full h-80 overflow-hidden rounded-lg shadow-lg"
            imageClassName="w-full h-full object-cover transition hover:scale-105"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <DisplayInfo
            info={[
              { label: "Nombre", value: product.name },
              { label: "Descripción", value: product.description },
              { label: "Activo", value: product.active ? "Sí" : "No" },
            ]}
          />
        </div>

        {/* Detalles y Fechas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Detalles y Fechas</h2>
          <DisplayInfo
            info={[
              {
                label: "Creado",
                value: new Date(product.createdAt).toLocaleDateString(),
              },
              {
                label: "Actualizado",
                value: new Date(product.updatedAt).toLocaleDateString(),
              },
            ]}
          />
        </div>
      </div>

      {/* Galería de Imágenes */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Imágenes</h2>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <ImagePreview
                key={img.id}
                src={img.url}
                alt={`Imagen de ${product.name}`}
                onPreview={() => window.open(img.url, "_blank")}
                // No se muestra el botón de eliminar en la vista de detalles
                containerClassName="relative w-32 h-32"
                imageClassName="w-full h-full object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No hay imágenes disponibles.</p>
        )}
      </div>

      {/* Categorías */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Este producto no está asignado a ninguna categoría.
          </p>
        )}
      </div>

      {/* Variantes */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Variantes</h2>
        {variants.length > 0 ? (
          <DisplayTableInfo
            headers={["ID", "Tamaño", "Precio", "Stock"]}
            data={variants.map((variant, index) => ({
              ID: `${variant.id}-${index}`,
              Tamaño: variant.size,
              Precio: variant.price,
              Stock: variant.stock,
            }))}
            keyField="ID"
          />
        ) : (
          <p className="text-gray-600">No hay variantes disponibles.</p>
        )}
      </div>

      <div className="mt-8">
        <Link
          href={`/admin/catalogo/${product.id}/editar`}
          className="btn btn-outline btn-info"
        >
          Editar Producto
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
