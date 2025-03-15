'use client';

import React, { useState, useEffect } from "react";
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
  const [discount, setDiscount] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!isNaN(p) && !isNaN(d)) {
      if (d < 0 || d > 100) {
        setDiscountError("El descuento debe estar entre 0 y 100");
        setDiscountedPrice(null);
      } else {
        setDiscountError("");
        const dp = p * (1 - d / 100);
        setDiscountedPrice(Math.round(dp * 100) / 100);
      }
    } else {
      setDiscountedPrice(null);
      setDiscountError("");
    }
  }, [price, discount]);

  const variantsData = variants.map((variant) => ({
    id: variant.id,
    Tamaño: variant.size,
    Precio: variant.price,
    Stock: variant.stock,
    Descuento: variant.discount || 0,
    "Precio con Descuento": variant.discountPrice || 0,
    Eliminar: (
      <ActionButton onClick={() => handleRemove(variant.id)} />
    ),
  }));

  async function handleAdd() {
    if (!size.trim() || !price || !stock) return;
    const discountValue = discount.trim() ? parseFloat(discount) : 0;
    if (discountValue < 0 || discountValue > 100) {
      setDiscountError("El descuento debe estar entre 0 y 100");
      return;
    }
    console.log(discountValue)
    await addVariantAction(
      productId!,
      size.trim(),
      parseFloat(price),
      parseInt(stock, 10),
      discountValue
    );
    setSize("");
    setPrice("");
    setStock("");
    setDiscount("");
    setDiscountedPrice(null);
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
      <div className="grid grid-cols-5 gap-2 mb-2">
        <input
          type="text"
          placeholder="Tamaño"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="input input-bordered col-span-1"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input input-bordered col-span-1"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input input-bordered col-span-1"
        />
        <input
          type="number"
          placeholder="Descuento (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="input input-bordered col-span-1"
        />
        <button
          type="button"
          className="btn btn-secondary col-span-1"
          onClick={handleAdd}
          disabled={!productId}
        >
          Agregar
        </button>
      </div>
      {discountError && <p className="text-error mb-2">{discountError}</p>}
      {discountedPrice !== null && parseFloat(discount) > 0 && (
        <p className="mb-2">
          Precio con descuento: ${discountedPrice.toFixed(2)} (Ahorras $
          {(parseFloat(price) - discountedPrice).toFixed(2)})
        </p>
      )}
      <div className="overflow-x-auto">
        <DisplayTableInfo
          headers={["Tamaño", "Precio", "Stock", "Descuento", "Precio con Descuento", "Eliminar"]}
          data={variantsData}
          keyField="id"
          renderCustomCell={renderCustomCell}
        />
      </div>
    </div>
  );
};

export default VariantsForm;
