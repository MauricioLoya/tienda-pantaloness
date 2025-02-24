"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function UserDetailsPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          const errorData = await res.json()
          setError(errorData.error || 'Error al obtener el usuario')
        }
      } catch (err: any) {
        setError(err.message || 'Error al obtener el usuario')
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  if (loading) return <div className="p-4">Cargando...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!user) return <div className="p-4">Usuario no encontrado.</div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Detalles del Usuario</h1>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">ID:</span>
        <span className="ml-2">{user.id}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Email:</span>
        <span className="ml-2">{user.email}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Nombre:</span>
        <span className="ml-2">{user.name}</span>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Super Admin:</span>
        <span className="ml-2">{user.superAdmin ? 'Sí' : 'No'}</span>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/admin/users/${user.id}/editar`)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Editar
        </button>
      </div>
    </div>
  )
}
