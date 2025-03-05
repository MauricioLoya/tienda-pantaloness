import React from 'react'
import Link from 'next/link'
import { ProductAdminTableRow } from '../definitions'
import DisplayTableInfo from '@/lib/components/DisplayTableInfo'

type Props = {
  values: ProductAdminTableRow[]
}

const ProductTable: React.FC<Props> = ({ values }) => {
  const headers = ['ID', 'Nombre', 'Precio Base', 'Activo', 'Categorias', 'Fecha de Creación', 'Opciones']
  const data = values.map((product) => ({
    ID: product.id,
    Nombre: product.name,
    'Precio Base': product.basePrice,
    Activo: product.active ? 'Sí' : 'No',
    Categorias: product.categories.length > 0 ? product.categories : 'Ninguna',  
    'Fecha de Creación': new Date(product.createdAt).toLocaleDateString(),
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900 transition"
        href={`/admin/catalogo/${product.id}`}
      >
        Detalles
      </Link>
    )
  }))
  
  return <DisplayTableInfo headers={headers} data={data} />
}

export default ProductTable
