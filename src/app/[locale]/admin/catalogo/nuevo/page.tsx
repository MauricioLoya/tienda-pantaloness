import React from 'react'
import ProductForm from '@/modules/catalogue/components/ProductForm'

const CreateProductPage: React.FC = async () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>
      <ProductForm mode="create" />
    </div>
  )
}

export default CreateProductPage
