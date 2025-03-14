"use client";

import React, { useState } from "react";
import { addCategoryAction } from "../actions/addCategoryAction";
import { removeCategoryAction } from "../actions/removeCategoryAction";
import { useRouter } from "next/navigation";
import { CategoryItem } from "../definitions";

interface CategoriesFormProps {
  productId?: number;
  categories?: CategoryItem[];
  allCategories: CategoryItem[];
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  productId,
  categories = [],
  allCategories,
}) => {
  const [selectedCat, setSelectedCat] = useState("");
  const router = useRouter();

  const availableCats = allCategories.filter(
    (c) => !categories.some((cc) => cc.id === c.id)
  );

  async function handleAdd() {
    if (!selectedCat || !productId) return;
    const catId = parseInt(selectedCat, 10);
    await addCategoryAction(productId, catId);
    router.refresh();
  }

  async function handleRemove(categoryId: number) {
    if (productId) await removeCategoryAction(productId, categoryId);
    router.refresh();
  }

  return (
    <div className="card shadow p-4">
      <div className="grid gap-5">
        <h2 className="text-xl font-bold">Categorías</h2>
        <div className="flex gap-2">
          <select
            className="select select-bordered w-full"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {availableCats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={handleAdd}
            disabled={!productId}
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex gap-2">
              <button className="btn flex-wrap">
                {cat.name}
                <div
                  className="btn btn-xs btn-circle btn-error"
                  onClick={() => handleRemove(cat.id)}
                >
                  X
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesForm;
