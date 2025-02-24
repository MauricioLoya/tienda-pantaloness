"use client"

import Header from '@/modules/admin-dashboard/components/Header'
import UserList from '@/modules/user/components/UserList'
import React from 'react'

const UserPage: React.FC = () => {
  return (
    <>
      <Header
        title="👥 Usuarios"
        description="Gestiona los usuarios de la aplicación."
      />
      <UserList />
    </>
  )
}

export default UserPage
