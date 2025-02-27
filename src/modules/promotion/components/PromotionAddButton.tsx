'use client'

import Link from 'next/link'
import React from 'react'

const PromotionAddButton: React.FC = () => {
  return (
    <Link
      href="/admin/promociones/nuevo"
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Agregar Promoción
    </Link>
  )
}

export default PromotionAddButton
