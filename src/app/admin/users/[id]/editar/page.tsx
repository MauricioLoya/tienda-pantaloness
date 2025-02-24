"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import UserForm from '@/modules/user/components/UserForm'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`)

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          console.error('Error al obtener el usuario')
        }
      } catch (error) {
        console.error('Error al obtener el usuario', error)
      }
    }
    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  const handleUpdate = async (data: any) => {
    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        router.push('/admin/users')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al actualizar el usuario')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!user) return <div className="p-4">Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <UserForm initialData={user} onSubmit={handleUpdate} mode="update" />
    </div>
  )
}
