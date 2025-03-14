'use client';

import React, { useState } from "react";
import { addVariantAction } from "../actions/addVariantAction";
import { removeVariantAction } from "../actions/removeVariantAction";
import { useRouter } from "next/navigation";
import { VariantItem } from "../definitions";
import DisplayTableInfo from "@/lib/components/DisplayTableInfo";
import ActionButton from "@/lib/components/ActionButton";

interface VariantsFormProps {
  productId?: number;
  variants?: VariantItem[];
}

const VariantsForm: React.FC<VariantsFormProps> = ({ productId, variants = [] }) => {
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const router = useRouter();

  const variantsData = variants.map((variant) => ({
    id: variant.id,
    Tamaño: variant.size,
    Precio: variant.price,
    Stock: variant.stock,
  }));

  async function handleAdd() {
    if (!size.trim() || !price || !stock || !productId) return;
    await addVariantAction(
      productId,
      size.trim(),
      parseFloat(price),
      parseInt(stock, 10)
    );
    setSize("");
    setPrice("");
    setStock("");
    router.refresh();
  }

  async function handleRemove(variantId: number) {
    await removeVariantAction(variantId);
    router.refresh();
  }

  const renderCustomCell = (header: string, row: any) => {
    if (header === "Eliminar") {
      return <ActionButton onClick={() => handleRemove(row.id)} />;
    }
    return undefined;
  };

  return (
    <div className="card shadow p-4">
      <h2 className="text-xl font-bold mb-2">Variantes</h2>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <input
          type="text"
          placeholder="Tamaño"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input input-bordered"
        />
      </div>
      <button
        type="button"
        className="btn btn-secondary mb-4"
        onClick={handleAdd}
        disabled={!productId}
      >
        Agregar Variante
      </button>
      <div className="overflow-x-auto">
        <DisplayTableInfo
          headers={["Tamaño", "Precio", "Stock", "Eliminar"]}
          data={variantsData}
          keyField="id"
          renderCustomCell={renderCustomCell}
        />
      </div>
    </div>
  );
};

export default VariantsForm;