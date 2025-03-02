import React from 'react'
import Link from 'next/link'
import { Promotion } from '@prisma/client'
import DisplayTableInfo from '@/lib/components/DisplayTableInfo'

type Props = {
  values: Promotion[]
}

const PromotionTable: React.FC<Props> = ({ values }) => {
  const headers = ['Código', 'Nombre', 'Descripción', 'Descuento', 'Opciones']
  const data = values.map((promotion) => ({
    Código: promotion.code,
    Nombre: promotion.name,
    Descripción: promotion.description,
    Descuento: `${promotion.discount}%`,
    Opciones: (
      <Link
        className="text-indigo-600 hover:text-indigo-900 transition"
        href={`/admin/promociones/${promotion.id}`}
      >
        Detalles
      </Link>
    )
  }))
  return <DisplayTableInfo headers={headers} data={data} />

}

export default PromotionTable
