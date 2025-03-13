import Header from '@/modules/admin-dashboard/components/Header'
import React, { Suspense } from 'react'
import Loader from '@/lib/components/Loader'

type Props = {
  children: React.ReactNode
}
const UserLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header
        title="👥 Usuarios"
        description="Gestiona los usuarios de la aplicación."
      />
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </>
  )
}

export default UserLayout
