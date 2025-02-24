"use client"

import { useRouter } from 'next/navigation'
import UserForm from '@/modules/user/components/UserForm'
import { useState } from 'react'

export default function CreateUserPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Simula que el usuario actual es superAdmin.
          'x-super-admin': 'true' 
        },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        router.push('/admin/users')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al crear el usuario')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Nuevo Usuario</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <UserForm onSubmit={handleCreate} mode="create" />
    </div>
  )
}
