'use client'

import React, { useState } from 'react'
import { addVariantAction } from '../actions/addVariantAction'
import { removeVariantAction } from '../actions/removeVariantAction'
import { useRouter } from 'next/navigation'
import { VariantItem } from '../definitions'

interface VariantsFormProps {
  productId: number
  variants: VariantItem[]
}

const VariantsForm: React.FC<VariantsFormProps> = ({ productId, variants }) => {
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const router = useRouter()

  async function handleAdd() {
    if (!size.trim() || !price || !stock) return
    await addVariantAction(productId, size.trim(), parseFloat(price), parseInt(stock, 10))
    setSize('')
    setPrice('')
    setStock('')
    router.refresh()
  }

  async function handleRemove(variantId: number) {
    await removeVariantAction(variantId)
    router.refresh()
  }

  return (
    <div className="card shadow p-4">
      <h2 className="text-xl font-bold mb-2">Variantes</h2>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <input
          type="text"
          placeholder="Tamaño"
          className="input input-bordered"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          className="input input-bordered"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock"
          className="input input-bordered"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>
      <button className="btn btn-secondary mb-4" onClick={handleAdd}>
        Agregar Variante
      </button>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Tamaño</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.id}>
                <td>{v.size}</td>
                <td>{v.price}</td>
                <td>{v.stock}</td>
                <td>
                  <button
                    className="btn btn-xs btn-circle btn-error"
                    onClick={() => handleRemove(v.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VariantsForm
