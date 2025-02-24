"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([])
  const [filter, setFilter] = useState<string>('')
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users')
        if (res.ok) {
          const data = await res.json()
          setUsers(data)
        } else {
          console.error('Error al obtener usuarios')
        }
      } catch (error) {
        console.error('Error al obtener usuarios', error)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
    )
  }, [users, filter])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filtros
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => router.push('/admin/users/nuevo')}
        >
          Agregar Usuario
        </button>
      </div>
      {showFilter && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Filtrar por nombre o email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded w-full"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Super Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.superAdmin ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 transition"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserList
