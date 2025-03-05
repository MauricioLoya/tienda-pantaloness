import React from "react";
import { ProductDetail as Product } from "../definitions";
import DisplayInfo from "@/lib/components/DisplayInfo";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";
import GoBack from "@/lib/components/GoBack";
import Link from "next/link";

type Props = {
  productProp: Product;
};

const ProductDetail: React.FC<Props> = ({ productProp }) => {
  const { product, images, categories, variants } = productProp;
  const variantHeaders = ["ID", "Tamaño", "Precio", "Stock"];
  return (
    <div className="p-2">
      <GoBack href="./" />
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 my-2">
          Detalles del producto {product.name}
        </h1>
        <Link
          className="text-indigo-600 hover:text-indigo-900 transition"
          href={`/admin/catalogo/${product.id}/editar`}
        >
          Editar
        </Link>
      </div>
      <div className="divider divider-neutral" />
      <div className="grid gap-6">
        <DisplayInfo
          info={[
            {
              label: "Nombre",
              value: product.name,
            },
            {
              label: "Descripción",
              value: product.description,
            },
          ]}
        />
        <DisplayInfo
          info={[
            {
              label: "Precio Base",
              value: `$${product.basePrice}`,
            },
            {
              label: "Activo",
              value: `${product.active ? "Sí" : "No"}`,
            },
          ]}
        />

        <DisplayInfo
          info={[
            {
              label: "Creado",
              value: `${new Date(product.createdAt).toLocaleDateString()}`,
            },
            {
              label: "Actualizado",
              value: `${new Date(product.updatedAt).toLocaleDateString()}`,
            },
          ]}
        />
      </div>
      <h3 className="text-lg text-black font-bold mb-2">Imágenes</h3>
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.url}
                alt="Imagen"
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-black">No hay imágenes.</p>
      )}

      <div className="divider"></div>

      <h3 className="text-lg text-black font-bold mb-2">Categorías</h3>
      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.id} className="badge badge-outline">
              {cat.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-black">No hay categorías.</p>
      )}

      <div className="divider"></div>
      <div className="card-body">
        <h3 className="text-lg text-black mb-2">Variantes</h3>
        <DisplayTableInfo headers={variantHeaders} data={variants} />
      </div>
    </div>
  );
};

export default ProductDetail;
