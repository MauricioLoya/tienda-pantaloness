import UserForm from '@/modules/user/components/UserForm'
import { UserRepository } from '@/modules/user/definitions'
import React from 'react'

type Props = {
  params: { id: string }
}

const EditUserPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  const userRepo = new UserRepository()
  const user = await userRepo.getById(Number(id))
  if (!user) {
    return <div>Usuario no encontrado</div>
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <UserForm id={id} initialData={user} mode="update" />
    </div>
  )
}

export default EditUserPage
