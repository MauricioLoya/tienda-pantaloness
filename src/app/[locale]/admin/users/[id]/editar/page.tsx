import UserForm from '@/modules/user/components/UserForm'
import { UserRepository } from '@/modules/user/definitions'
import React from 'react'
import HeaderContent from "@/lib/components/HeaderContent";

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
    <div>
      <HeaderContent title={`Editar Usuario ${user.name}`} href="./" />
      <UserForm id={id} initialData={user} mode="update" />
    </div>
  )
}

export default EditUserPage
