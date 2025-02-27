'use client'

import Link from 'next/link'
import React from 'react'

const UserAddButton: React.FC = () => {
  return (
    <Link
      href="/admin/users/nuevo"
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Agregar Usuario
    </Link>
  )
}

export default UserAddButton
