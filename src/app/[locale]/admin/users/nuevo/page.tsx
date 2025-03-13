import UserForm from '@/modules/user/components/UserForm'
import React from 'react'

const CreateUserPage: React.FC = async () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Nuevo Usuario</h1>
      <UserForm mode="create" />
    </div>
  )
}

export default CreateUserPage
