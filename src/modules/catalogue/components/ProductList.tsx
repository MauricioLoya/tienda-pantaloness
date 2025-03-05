import React from 'react'
import { ProductRepository } from '../definitions'
import ProductTable from './ProductTable'
import Link from 'next/link'

const ProductList: React.FC = async () => {
  const promotionRepo = new ProductRepository()
  const products = await promotionRepo.getProducts()

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4">
        <Link
          href="/admin/catalogo/nuevo"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Agregar Producto
        </Link>
      </div>
      
      <ProductTable values={products} />
    </div>
  )
}

export default ProductList
