import UserForm from '@/modules/user/components/UserForm'
import React from 'react'
import HeaderContent from "@/lib/components/HeaderContent";

const CreateUserPage: React.FC = async () => {
  return (
    <div className="">
      <HeaderContent title={`Nuevo Usuario`} href="./" />
      <UserForm mode="create" />
    </div>
  )
}

export default CreateUserPage
