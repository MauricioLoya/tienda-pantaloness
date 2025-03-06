'use client'

import React, { useState } from 'react'
import { addCategoryAction } from '../actions/addCategoryAction'
import { removeCategoryAction } from '../actions/removeCategoryAction'
import { useRouter } from 'next/navigation'
import { CategoryItem } from '../definitions'

interface CategoriesFormProps {
  productId: number
  categories: CategoryItem[] // las categorías ya asociadas
  allCategories: CategoryItem[] // TODAS las categorías disponibles en el sistema
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  productId,
  categories,
  allCategories
}) => {
  const [selectedCat, setSelectedCat] = useState('')
  const router = useRouter()

  // Filtramos las categorías que aún no están asociadas
  const availableCats = allCategories.filter(
    c => !categories.some(cc => cc.id === c.id)
  )

  async function handleAdd() {
    if (!selectedCat) return
    const catId = parseInt(selectedCat, 10)
    await addCategoryAction(productId, catId)
    router.refresh()
  }

  async function handleRemove(categoryId: number) {
    await removeCategoryAction(productId, categoryId)
    router.refresh()
  }

  return (
    <div className="card  shadow p-4">
      <div className="grid gap-5">
        <h2 className="text-xl font-bold">Categorías</h2>
        <div className="flex gap-2">
          <select
            className="select select-bordered w-full"
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {availableCats.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={handleAdd}>
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <div key={cat.id} className="badge badge-outline gap-2">
              {cat.name}
              <button
                type="button"
                className="btn btn-xs btn-circle btn-error"
                onClick={() => handleRemove(cat.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesForm
