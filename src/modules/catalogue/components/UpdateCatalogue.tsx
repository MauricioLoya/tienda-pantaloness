'use client'
import React from "react";
import BasicForm from "./BasicForm";
import ImagesForm from "./ImagesForm";
import CategoriesForm from "./CategoriesForm";
import VariantsForm from "./VariantsForm";
import { RegionItem } from "@/modules/region/definitions";
import { ProductInput, ImageItem, VariantItem } from "@/modules/catalogue/definitions";
import { useRouter } from "next/navigation";
import { CategoryItem } from "@/modules/category/definitions";

interface EditCatalogueViewProps {
  productId: number;
  productData: ProductInput;
  regions: RegionItem[];
  allCategories: CategoryItem[];
  images: ImageItem[];
  categories: CategoryItem[];
  variants: VariantItem[];
}

/**
 * Vista completa para editar un producto existente.
 * Esta vista muestra en secciones el formulario básico (para actualizar la información principal)
 * y los formularios de imágenes, categorías y variantes, que se encargan de gestionar cada aspecto del producto.
 */
const EditCatalogueView: React.FC<EditCatalogueViewProps> = ({
  productId,
  productData,
  regions,
  allCategories,
  images,
  categories,
  variants,
}) => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
        <button
          onClick={() => router.push("/admin/catalogo")}
          className="mt-4 md:mt-0 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Volver a Catálogo
        </button>
      </div>

      {/* Formulario básico para la información principal del producto */}
      <div className="mb-8">
        <BasicForm productId={productId} initialData={productData} regions={regions} />
      </div>

      {/* Sección de imágenes y categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ImagesForm productId={productId} images={images} />
        <CategoriesForm productId={productId} categories={categories} allCategories={allCategories} />
      </div>

      {/* Sección de variantes */}
      <div className="mb-8">
        <VariantsForm productId={productId} variants={variants} />
      </div>
    </div>
  );
};

export default EditCatalogueView;
