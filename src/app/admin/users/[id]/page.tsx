import { UserRepository } from '@/modules/user/definitions'
import React from 'react'

type Props = {
  params: { id: string }
}

const UserDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  const userRepo = new UserRepository()
  const user = await userRepo.getById(Number(id))
  if (!user) {
    return <div>Usuario no encontrado</div>
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Detalles del Usuario</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Super Admin:</strong> {user.superAdmin ? 'Sí' : 'No'}</p>
      <div className="flex justify-end">
        <a
          href={`/admin/users/${user.id}/editar`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Editar
        </a>
      </div>
    </div>
  )
}

export default UserDetailsPage